import { RequestHandler } from "express";
import { JwtService } from "../services/auth/jwt.service";
import { UserContext } from "../contexts/user.context";
import { Unauthorized } from "../errors/unauthorized.error";
import { Forbidden } from "../errors/forbidden.error";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'] as string | undefined;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(Unauthorized.Error());
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = JwtService.verify<{ userId: number }>(token);
    UserContext.run(payload.userId, () => {
      next();
    });
  } catch (err) {
    return next(Forbidden.Error());
  }
};