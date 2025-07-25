import express, { NextFunction, Request, Response } from "express"
import { loginValidation, refreshTokenValidation, signupValidation } from "./validators/auth.validator";
import { validateRequest } from "../middlewares/validateRequest";
import { AuthService } from "../services/auth/auth.service";

class AuthController {
    public path = '/auth';
    public router: express.Router = express.Router();

    constructor(private readonly service: AuthService) {
        this.router.post(this.path + '/login', loginValidation, validateRequest, this.login);
        this.router.post(this.path + '/refresh', refreshTokenValidation, validateRequest, this.refresh);
        this.router.post(`${this.path}/signup`, signupValidation, validateRequest, this.signup);
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        try {
            const result = await this.service.login(email, password);
            res.status(200).json(result);
        } catch (err: any) {
            next(err);
        }
    };

    public refresh = async (req: Request, res: Response, next: NextFunction) => {
        const { refreshToken } = req.body;
        const tokens = await this.service.refreshTokens(refreshToken);
        res.json(tokens);
    }

    public signup = async (req: Request, res: Response) => {
        const { firstName, lastName, email, password } = req.body;
        const user = await this.service.signup(firstName, lastName, email, password);
        res.status(201).json(user);
    };
}

export default AuthController;