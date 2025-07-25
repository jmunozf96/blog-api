import App from "./app";
import AccountController from "./controllers/account.controller";
import AuthController from "./controllers/auth.controller";
import { PostRepository } from "./repositories/post.repository";
import AccountService from "./services/auth/account.service";
import { AuthService } from "./services/auth/auth.service";
import { BcryptHasher } from "./services/bcrypt-hasher";
import { PostService } from "./services/post.service";
import { PostController } from "./controllers/post.controller";
import { CommentRepository } from "./repositories/comment.repository";
import { CommentService } from "./services/comment.service";
import { CommentController } from "./controllers/comment.controller";
import dotenv from 'dotenv';
dotenv.config();

const postRepository = new PostRepository();
const commentRepository = new CommentRepository();

const bcryptHasher = new BcryptHasher();
const authService = new AuthService(bcryptHasher);
const accountService = new AccountService();
const postService = new PostService(postRepository);
const commentService = new CommentService(commentRepository, postRepository);

const authController = new AuthController(authService);
const accountController =  new AccountController(accountService);
const postController = new PostController(postService);
const commentController = new CommentController(commentService);

const app = new App([authController, accountController, postController, commentController], 3000);

app.listen();

export default app;