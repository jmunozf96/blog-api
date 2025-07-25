import { Comment } from "../generated/prisma"

export interface CommentDTO {
    id: string
    content: string
    postId: string
    authorId: number
    createdAt: Date
    updatedAt: Date
}

export const toDTO = (model: Comment): CommentDTO => {
    return {
        id: model.id,
        postId: model.postId,
        content: model.content,
        authorId: model.authorId,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
    }
}

export const toDTOs = (model: Comment[]): CommentDTO[] => {
    return model.map(toDTO)
}