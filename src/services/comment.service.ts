import { CommentRepository } from '../repositories/comment.repository';
import { PostRepository } from '../repositories/post.repository';
import { Comment } from '../generated/prisma';
import { NotFoundError } from '../errors/not-found.error';
import { Forbidden } from '../errors/forbidden.error';
import { getPaginationParams, PaginatedResult } from '../models/pagination.model';

export class CommentService {
    constructor(
        private commentRepo: CommentRepository,
        private postRepo: PostRepository
    ) { }

    async createComment(postId: string, authorId: number, content: string): Promise<Comment> {
        const post = await this.postRepo.findById(postId);
        if (!post) {
            throw new NotFoundError('Post not found');
        }
        return await this.commentRepo.create(post.id, authorId, content);
    }

    async getCommentsByPost(postId: string): Promise<Comment[]> {
        return await this.commentRepo.findByPost(postId);
    }

    async getCommentsByPostPaginated(
        postId: string,
        query: any
    ): Promise<PaginatedResult<Comment>> {
        const pagination = getPaginationParams(query);
        return await this.commentRepo.findByPostPaginated(postId, pagination);
    }

    async updateComment(id: string, authorId: number, content: string): Promise<Comment> {
        const comment = await this.commentRepo.findByIdAndAuthor(id, authorId);
        if (!comment) {
            throw new Forbidden('Not authorized to edit this comment');
        }
        return await this.commentRepo.updateByAuthor(id, authorId, content);
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
