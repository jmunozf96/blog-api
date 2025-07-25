import { Post } from "../generated/prisma"
import { PaginationParams } from "./pagination.model"

export interface PostDTO {
    id: string
    title: string
    content: string
    imageUrl: string
    authorId: number
    publishedAt: Date
    updatedAt: Date
}

export interface PostPaginationParams extends PaginationParams {
    title?: string;
    publishedAfter?: string;
    publishedBefore?: string;
}

export const toDTO = (model: Post): PostDTO => {
    return {
        id: model.id,
        title: model.title,
        content: model.content,
        imageUrl: model.imageUrl,
        authorId: model.authorId,
        publishedAt: model.publishedAt,
        updatedAt: model.updatedAt
    }
}

export const toDTOs = (model: Post[]): PostDTO[] => {
    return model.map(toDTO)
}

export const getPaginationParams = (query: any): PostPaginationParams => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const title = query.title ? String(query.title) : undefined;
    const isValidDate = (dateStr: string) => !isNaN(Date.parse(dateStr));

    const publishedAfter = isValidDate(query.publishedAfter)
        ? new Date(query.publishedAfter).toISOString()
        : undefined;

    const publishedBefore = isValidDate(query.publishedBefore)
        ? new Date(query.publishedBefore).toISOString()
        : undefined;

    return { page, limit, title, publishedAfter, publishedBefore };
}