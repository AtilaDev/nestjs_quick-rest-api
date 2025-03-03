import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(limit?: number) {
    const usersFound = await this.prisma.user.findMany({
      ...(limit ? { take: limit } : {}),
    });

    return {
      totalCount: usersFound.length,
      users: usersFound,
    };
  }

  async getUserByEmail(email: string) {
    const userByEmailFound = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userByEmailFound) {
      return new NotFoundException(`User with id ${email} not found`);
    }

    return userByEmailFound;
  }
}
