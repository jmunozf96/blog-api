import express, { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserContext } from '../contexts/user.context';
import { createCommentValidation, deleteCommentValidation, updateCommentValidation } from './validators/comment.validator';
import { validateRequest } from '../middlewares/validateRequest';

export class CommentController {
    public path = '/posts/:postId/comments';
    public router = express.Router();

    constructor(private commentService: CommentService) {
        this.router.use(this.path, authMiddleware);

        this.router.post(this.path, createCommentValidation, validateRequest, this.createComment);
        this.router.get(this.path, this.getCommentsByPost);
        this.router.put(`${this.path}/:commentId`, updateCommentValidation, validateRequest, this.updateComment);
        this.router.delete(`${this.path}/:commentId`, deleteCommentValidation, validateRequest, this.deleteComment);
    }

    public createComment = async (req: Request, res: Response) => {
        const userId = UserContext.getUserId();
        const { postId, content } = req.body;
        const comment = await this.commentService.createComment(postId, userId, content);
        res.status(201).json(comment);
    };

    public getCommentsByPost = async (req: Request, res: Response) => {
        const { postId } = req.params;
        const result = await this.commentService.getCommentsByPostPaginated(postId, req.query);
        res.json(result);
    };

    public updateComment = async (req: Request, res: Response) => {
        const userId = UserContext.getUserId();
        const { content } = req.body;
        const comment = await this.commentService.updateComment(req.params.commentId, userId, content);
        res.json(comment);
    };

    public deleteComment = async (req: Request, res: Response) => {
        const userId = UserContext.getUserId();
        await this.commentService.deleteComment(req.params.commentId, userId);
        res.status(204).send();
    };
}
