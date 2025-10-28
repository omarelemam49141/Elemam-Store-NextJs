import { prisma } from "../../lib/db/prisma";
import { compare } from "bcrypt-ts-edge";

export class AuthService {
  static async validateCredentials(email: string, password: string) {
    const userWithEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userWithEmail) {
      return null;
    }

    const isCorrectPassword = await compare(password, userWithEmail.password as string);

    if (!isCorrectPassword) {
      return null;
    }

    return {
      id: userWithEmail.id,
      email: userWithEmail.email,
      name: userWithEmail.name,
      role: userWithEmail.role,
    };
  }

  static async updateUserName(userId: string, name: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { name: name },
    });
  }

  static async updateUserNameFromEmail(userId: string, email: string) {
    const name = email.split("@")[0];
    return await this.updateUserName(userId, name);
  }
}
