import prisma from '../prisma';
import { Comment } from '../generated/prisma';
import { PaginationParams, PaginatedResult } from '../models/pagination.model';
import { NotFoundError } from '../errors/not-found.error';

export class CommentRepository {
    async create(postId: string, authorId: number, content: string): Promise<Comment> {
        return prisma.comment.create({
            data: { postId, authorId, content },
        });
    }

    async findByPost(postId: string): Promise<Comment[]> {
        return prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
        });
    }

    async findByPostPaginated(
        postId: string,
        params: PaginationParams
    ): Promise<PaginatedResult<Comment>> {
        const { page, limit } = params;
        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where: { postId },
                orderBy: { createdAt: 'asc' },
                skip,
                take: limit,
            }),
            prisma.comment.count({ where: { postId } }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: comments,
            meta: { total, page, limit, totalPages },
        };
    }

    async findById(id: string): Promise<Comment | null> {
        return prisma.comment.findUnique({ where: { id } });
    }

    async findByIdAndAuthor(id: string, authorId: number): Promise<Comment | null> {
        return prisma.comment.findFirst({
            where: { id, authorId },
        });
    }

    async updateByAuthor(id: string, authorId: number, content: string): Promise<Comment> {
        const comment = await this.findByIdAndAuthor(id, authorId);
        if (!comment) throw new NotFoundError('Comment not found');

        return prisma.comment.update({
            where: { id },
            data: { content },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.comment.delete({ where: { id } });
    }

    async findAuthorIdsForComment(id: string): Promise<{ commentAuthorId: number; postAuthorId: number } | null> {
        const result = await prisma.comment.findUnique({
            where: { id },
            select: {
                authorId: true,
                post: {
                    select: {
                        authorId: true,
                    },
                },
            },
        });

        if (!result) return null;

        return {
            commentAuthorId: result.authorId,
            postAuthorId: result.post.authorId,
        };
    }
}
