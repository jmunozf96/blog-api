import { Request, Response, Router } from 'express';
import { PostService } from '../services/post.service';
import { upload } from '../middlewares/upload.middleware';
import { createPostValidation, postQueryValidation, updatePostValidation } from './validators/post.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/auth.middleware';
import { multerErrorHandler } from '../middlewares/multer.middleware';
import { UserContext } from '../contexts/user.context';

export class PostController {
    public path = '/posts';
    public router: Router = Router();

    constructor(private postService: PostService) {
        this.router.use(this.path, authMiddleware);
        this.router.post(this.path, upload.single('image'), multerErrorHandler, createPostValidation, validateRequest, this.createPost);
        this.router.get(this.path + '/', postQueryValidation, validateRequest, this.getPosts);
        this.router.get(this.path + '/me', postQueryValidation, validateRequest, this.getCurrentUserPosts);
        this.router.get(this.path + '/:id', this.getPost);
        this.router.put(this.path + '/:id', upload.single('image'), multerErrorHandler, updatePostValidation, validateRequest, this.updatePost);
        this.router.delete(this.path + '/:id', this.deletePost);
    }

    public createPost = async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const { title, content } = req.body;
        const file = req.file;
        const post = await this.postService.createPost({
            title,
            content,
            authorId: UserContext.getUserId(),
            file
        });
        res.status(201).json(post);
    };

    public getPosts = async (req: Request, res: Response) => {
        const { page, limit, title, publishedAfter, publishedBefore } = req.query;
        const result = await this.postService.getPostsPaginated({
            page: Number(page),
            limit: Number(limit),
            title: title as string,
            publishedAfter: publishedAfter as string,
            publishedBefore: publishedBefore as string,
        });
        res.json(result);
    };

    public getCurrentUserPosts = async (req: Request, res: Response) => {
        const { page, limit, title, publishedAfter, publishedBefore } = req.query;
        const userId = UserContext.getUserId();
        const result = await this.postService.getUserPostsPaginated(userId, {
            page: Number(page),
            limit: Number(limit),
            title: title as string,
            publishedAfter: publishedAfter as string,
            publishedBefore: publishedBefore as string,
        });
        res.json(result);
    };

    public getPost = async (req: Request, res: Response) => {
        const userId = UserContext.getUserId();
        const post = await this.postService.getPost(req.params.id, userId);
        res.json(post);
    };

    public updatePost = async (req: Request, res: Response) => {
        const userId = UserContext.getUserId();
        const { title, content } = req.body;
        const file = req.file;
        const updatedPost = await this.postService.updatePost(req.params.id, {
            authorId: userId,
            title,
            content,
            file
        });
        res.json(updatedPost);
    };

    public deletePost = async (req: Request, res: Response) => {
        const userId = UserContext.getUserId();
        await this.postService.deletePost(req.params.id, userId);
        res.status(204).send();
    };
}
