import App from "./app";
import AccountController from "./controllers/account.controller";
import AuthController from "./controllers/auth.controller";
import AccountService from "./services/auth/account.service";
import { AuthService } from "./services/auth/auth.service";
import { BcryptHasher } from "./services/bcrypt-hasher";
import dotenv from 'dotenv';
dotenv.config();

const bcryptHasher = new BcryptHasher();
const authService = new AuthService(bcryptHasher);
const accountService = new AccountService();

const authController = new AuthController(authService);
const accountController =  new AccountController(accountService);
const app = new App([authController, accountController], 3000);

app.listen();

export default app;