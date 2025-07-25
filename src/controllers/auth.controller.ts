import express, { NextFunction, Request, Response } from "express"
import { loginValidation, refreshTokenValidation } from "./validators/auth.validator";
import { validateRequest } from "../middlewares/validateRequest";
import { AuthService } from "../services/auth/auth.service";

class AuthController {
    public path = '/auth';
    public router: express.Router = express.Router();

    constructor(private readonly service: AuthService) {
        this.router.post(this.path + '/login', loginValidation, validateRequest, this.login);
        this.router.post(this.path + '/refresh', refreshTokenValidation, validateRequest, this.refresh);
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
}

export default AuthController;