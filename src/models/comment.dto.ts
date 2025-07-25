import { Comment } from "../generated/prisma"

export interface CommentDTO {
    id: string
    content: string
    postId: string
    createdAt: Date
    updatedAt: Date
}

export const toDTO = (model: Comment): CommentDTO => {
    return {
        id: model.id,
        postId: model.postId,
        content: model.content,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
    }
}

export const toDTOs = (model: Comment[]): CommentDTO[] => {
    return model.map(toDTO)
}