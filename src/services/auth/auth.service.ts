import { IPasswordHasher } from "../../contracts/services/password-hasher";
import { CustomError } from "../../errors/custom.error";
import prisma from "../../prisma";
import { JwtService } from "./jwt.service";

export class AuthService {
  constructor(private readonly hasher: IPasswordHasher) {
  }

  public async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user)
    if (!user) throw new CustomError('Invalid credentials.');
    console.log(password)
    const isPasswordValid = await this.hasher.compare(password, user.password);
    if (!isPasswordValid) throw new CustomError('Invalid credentials.');

    const accessToken = JwtService.sign({ userId: user.id, email: user.email });
    const refreshToken = JwtService.signRefresh({ userId: user.id });

    await prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: refreshToken },
      create: { userId: user.id, token: refreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshTokens(refreshToken: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new CustomError('Invalid refresh token');
    }

    const user = storedToken.user;

    const newAccessToken = JwtService.sign({ userId: user.id });
    const newRefreshToken = JwtService.signRefresh({ userId: user.id });

    await prisma.refreshToken.update({
      where: { userId: user.id },
      data: { token: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}