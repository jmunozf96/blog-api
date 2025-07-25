import { CommentRepository } from '../repositories/comment.repository';
import { PostRepository } from '../repositories/post.repository';
import { Comment } from '../generated/prisma';
import { NotFoundError } from '../errors/not-found.error';
import { Forbidden } from '../errors/forbidden.error';
import { getPaginationParams, PaginatedResult } from '../models/pagination.model';
import { CommentDTO, toDTO, toDTOs } from '../models/comment.dto';

export class CommentService {
    constructor(
        private commentRepo: CommentRepository,
        private postRepo: PostRepository
    ) { }

    async createComment(postId: string, authorId: number, content: string): Promise<CommentDTO> {
        const post = await this.postRepo.findById(postId);
        if (!post) {
            throw new NotFoundError('Post not found');
        }
        var comment = await this.commentRepo.create(post.id, authorId, content);
        return toDTO(comment);
    }

    async getCommentsByPost(postId: string): Promise<CommentDTO[]> {
        var comments = await this.commentRepo.findByPost(postId);
        return toDTOs(comments);
    }

    async getCommentsByPostPaginated(
        postId: string,
        query: any
    ): Promise<PaginatedResult<CommentDTO>> {
        const pagination = getPaginationParams(query);
        var paginated = await this.commentRepo.findByPostPaginated(postId, pagination);
        return { data: toDTOs(paginated.data), meta: paginated.meta };
    }

    async updateComment(id: string, authorId: number, content: string): Promise<CommentDTO> {
        const comment = await this.commentRepo.findByIdAndAuthor(id, authorId);
        if (!comment) {
            throw new Forbidden('Not authorized to edit this comment');
        }
        const updated = await this.commentRepo.updateByAuthor(id, authorId, content);
        return toDTO(updated);
    }

    async deleteComment(id: string, authorId: number): Promise<void> {
        const authors = await this.commentRepo.findAuthorIdsForComment(id);
        if (!authors) throw new NotFoundError('Comment not found');

        const { commentAuthorId, postAuthorId } = authors;

        const isAuthorized = commentAuthorId === authorId || postAuthorId === authorId;
        if (!isAuthorized) {
            throw new Forbidden('Not authorized to delete this comment');
        }

        await this.commentRepo.delete(id);
    }
}
