import App from "./app";
import AccountController from "./controllers/account.controller";
import AuthController from "./controllers/auth.controller";
import { PostRepository } from "./repositories/post.repository";
import AccountService from "./services/auth/account.service";
import { AuthService } from "./services/auth/auth.service";
import { BcryptHasher } from "./services/bcrypt-hasher";
import dotenv from 'dotenv';
import { PostService } from "./services/post.service";
import { PostController } from "./controllers/post.controller";
dotenv.config();

const postRepo = new PostRepository();

const bcryptHasher = new BcryptHasher();
const authService = new AuthService(bcryptHasher);
const accountService = new AccountService();
const postService = new PostService(postRepo);

const authController = new AuthController(authService);
const accountController =  new AccountController(accountService);
const postController = new PostController(postService);

const app = new App([authController, accountController, postController], 3000);

app.listen();

export default app;