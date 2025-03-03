import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany();
  }

  getUserById(id: string) {
    const userByIdFound = this.prisma.user.findUnique({
      where: { userId: id },
    });

    if (!userByIdFound) {
      return new NotFoundException(`User with id ${id} not found`);
      // return `User with id ${id} not found`;
    }

    return userByIdFound;
  }

  getUserByEmail(email: string) {
    const userByEmailFound = this.prisma.user.findUnique({
      where: { email },
    });

    if (!userByEmailFound) {
      return new NotFoundException(`User with id ${email} not found`);
      // return `User with email ${email} not found`;
    }

    return userByEmailFound;
  }
}
