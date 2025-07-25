import { CustomError } from "../../errors/custom.error";
import { NotFoundError } from "../../errors/not-found.error";
import { UserDTO } from "../../models/user.dto";
import prisma from "../../prisma";

class AccountService {
    async getAccount(userId: number): Promise<UserDTO> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });

        if (!user) throw new NotFoundError('User not found');
        return <UserDTO>({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    }
}

export default AccountService;