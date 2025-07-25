import { Response, Request, NextFunction, Router } from 'express';
import AccountService from "../services/auth/account.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserContext } from '../contexts/user.context';

class AccountController {
    public path = '/account';
    public router: Router = Router();

    constructor(private readonly service: AccountService) {
        this.router.get(this.path, authMiddleware, this.getAccount);
    }

    public getAccount = async (_: Request, res: Response, next: NextFunction) => {
        const userId = UserContext.getUserId();
        try {
            const result = await this.service.getAccount(userId)
            res.status(200).json(result);
        } catch (err: any) {
            next(err);
        }
    };
}

export default AccountController;