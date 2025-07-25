import { Post } from "../generated/prisma"

export interface PostDTO {
    id: string
    title: string
    content: string
    imageUrl: string
    publishedAt: Date
}

export const toDTO = (model: Post): PostDTO => {
    return {
        id: model.id,
        title: model.title,
        content: model.content,
        imageUrl: model.imageUrl,
        publishedAt: model.publishedAt
    }
}

export const toDTOs = (model: Post[]): PostDTO[] => {
    return model.map(toDTO)
}