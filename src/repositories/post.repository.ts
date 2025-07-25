import { Post } from "../generated/prisma";
import { PaginatedResult } from "../models/pagination.model";
import { PostPaginationParams } from "../models/post.dto";
import prisma from "../prisma";

export class PostRepository {
    async create(data: Omit<Post, 'id' | 'publishedAt' | 'updatedAt'> & { imageUrl: string; imagePublicId: string }): Promise<Post> {
        return prisma.post.create({ data });
    }

    async findAllByUser(userId: number): Promise<Post[]> {
        return prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { publishedAt: 'desc' },
        });
    } private buildPostFilters(params: PostPaginationParams, userId?: number) {
        const { title, publishedAfter, publishedBefore } = params;
        const where: any = {};

        if (userId) {
            where.authorId = userId;
        }

        if (title) {
            where.title = { contains: title, mode: 'insensitive' };
        }

        if (publishedAfter || publishedBefore) {
            where.publishedAt = {};
            if (publishedAfter) {
                const afterDate = new Date(publishedAfter);
                if (!isNaN(afterDate.getTime())) {
                    where.publishedAt.gte = afterDate;
                }
            }
            if (publishedBefore) {
                const beforeDate = new Date(publishedBefore);
                if (!isNaN(beforeDate.getTime())) {
                    where.publishedAt.lte = beforeDate;
                }
            }
        }

        return where;
    }

    private async getPaginatedPosts(where: any, page: number, limit: number): Promise<PaginatedResult<Post>> {
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy: { publishedAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.post.count({ where }),
        ]);

        return {
            data: posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findAllPaginated(params: PostPaginationParams): Promise<PaginatedResult<Post>> {
        const where = this.buildPostFilters(params);
        return this.getPaginatedPosts(where, params.page, params.limit);
    }

    async findAllByUserPaginated(userId: number, params: PostPaginationParams): Promise<PaginatedResult<Post>> {
        const where = this.buildPostFilters(params, userId);
        return this.getPaginatedPosts(where, params.page, params.limit);
    }


    async findById(id: string): Promise<Post | null> {
        return prisma.post.findFirst({
            where: { id },
        });
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
