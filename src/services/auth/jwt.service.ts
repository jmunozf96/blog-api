import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

export class JwtService {
    public static getSecretKey(): string {
        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) throw new Error("Secret is required");
        return secret;
    }

    public static getRefreshSecret(): string {
        const secret = process.env.JWT_REFRESH_SECRET_KEY;
        if (!secret) throw new Error("Refresh secret is required");
        return secret;
    }

    public static sign(payload: object): string {
        const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
        return jwt.sign(payload, this.getSecretKey(), options);
    }

    public static signRefresh(payload: object): string {
        const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN };
        return jwt.sign(payload, this.getRefreshSecret(), options);
    }

    public static verify<T>(token: string): T {
        return jwt.verify(token, this.getSecretKey()) as T;
    }

    public static verifyRefresh<T>(token: string): T {
        return jwt.verify(token, this.getRefreshSecret()) as T;
    }
}