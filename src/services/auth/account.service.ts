import { CustomError } from "../../errors/custom.error";
import { User } from "../../generated/prisma";
import prisma from "../../prisma";

class AccountService {
    async getAccount(userId: number): Promise<Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });

        if (!user) throw new Error('User not found');
        return user;
    }
}

export default AccountService;