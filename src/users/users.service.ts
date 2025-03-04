import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';

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
      throw new NotFoundException(`User with id ${email} not found`);
    }

    return userByEmailFound;
  }

  async createUser(user: CreateUserDto) {
    if (!user?.email || !user?.username) {
      throw new BadRequestException('Email and username are required fields');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!!existingUser) {
      throw new ConflictException(
        `User with email ${user.email} already exists`,
      );
    }

    const newUser: CreateUserDto = {
      ...user,
      avatar: faker.image.avatar() ?? user.avatar,
      birthdate: faker.date.birthdate() ?? user.birthdate,
    };

    return await this.prisma.user.create({ data: newUser });
  }

  async deleteDB() {
    await this.prisma.user.deleteMany();
    return {
      status: HttpStatus.OK,
      message: 'All users have been deleted',
    };
  }

  async deleteUserByEmail(email: string) {
    const userByEmailFound = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userByEmailFound) {
      throw new NotFoundException(`User with id ${email} not found`);
    }

    await this.prisma.user.delete({
      where: { email },
    });

    return {
      status: HttpStatus.OK,
      message: `User with email ${email} has been deleted`,
    };
  }
}
