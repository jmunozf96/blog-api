import { Post } from "../generated/prisma";
import { PaginationResult } from "../models/pagination.model";
import prisma from "../prisma";

export class PostRepository {
    async create(data: Omit<Post, 'id' | 'publishedAt'> & { imageUrl: string; imagePublicId: string }): Promise<Post> {
        return prisma.post.create({ data });
    }

    async findAllByUser(userId: number): Promise<Post[]> {
        return prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { publishedAt: 'desc' },
        });
    }

    async findAllByUserPaginated(userId: number, page: number, limit: number): Promise<PaginationResult<Post>> {
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { authorId: userId },
                orderBy: { publishedAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.post.count({ where: { authorId: userId } }),
        ]);

        return {
            data: posts,
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async findByIdAndUser(id: string, userId: number): Promise<Post | null> {
        return prisma.post.findFirst({
            where: { id, authorId: userId },
        });
    }

    async updateByUser(id: string, userId: number, data: Partial<Post>): Promise<Post> {
        const existing = await this.findByIdAndUser(id, userId);
        if (!existing) throw new Error('Post not found or unauthorized');

        return prisma.post.update({
            where: { id },
            data,
        });
    }

    async deleteByUser(id: string, userId: number): Promise<void> {
        const existing = await this.findByIdAndUser(id, userId);
        if (!existing) throw new Error('Post not found or unauthorized');

        await prisma.post.delete({ where: { id } });
    }
}
