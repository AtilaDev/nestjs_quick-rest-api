import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { create } from 'domain';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    getUsers: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    deleteDB: jest.fn(),
    deleteUserByEmail: jest.fn(),
    updateUsernameByEmail: jest.fn(),
  };

  const mockUsers = [
    {
      userId: '1',
      username: 'test1',
      email: 'test1@example.com',
      avatar: 'avatar1.jpg',
      birthdate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const expectedResponse = {
        count: 1,
        users: mockUsers,
      };
      mockUsersService.getUsers.mockResolvedValue(expectedResponse);

      const result = await controller.getUsers();

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.getUsers).toHaveBeenCalled();
    });

    it('should return limited users when limit is provided', async () => {
      const limit = '5';
      const expectedResponse = { count: 1, users: mockUsers };
      mockUsersService.getUsers.mockResolvedValue(expectedResponse);

      const result = await controller.getUsers(limit);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.getUsers).toHaveBeenCalledWith(5);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user when email exists', async () => {
      const email = 'test1@example.com';
      mockUsersService.getUserByEmail.mockResolvedValue(mockUsers[0]);

      const result = await controller.getUserByEmail(email);

      expect(result).toEqual(mockUsers[0]);
      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should return not found when email does not exist', async () => {
      const email = 'nonexistent@example.com';
      mockUsersService.getUserByEmail.mockResolvedValue(null);

      const result = await controller.getUserByEmail(email);

      expect(result).toBeNull();
      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('createUser', () => {
    it('should create a new user into db', async () => {
      const mockCreateUserDto = {
        username: 'test1',
        email: 'test1@example.com',
        avatar: 'avatar1.jpg',
        birthdate: new Date(),
      };

      const mockCreatedUser = {
        userId: '1',
        ...mockCreateUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.createUser.mockResolvedValue(mockCreatedUser);

      const result = await controller.createUser(mockCreateUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
      );
    });
  });

  describe('should remove entire db', () => {
    it('should remove all users from db', async () => {
      const expectedResponse = {
        status: 200,
        message: 'All users have been deleted',
      };

      mockUsersService.deleteDB.mockResolvedValue(expectedResponse);

      const result = await controller.deleteDB();

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.deleteDB).toHaveBeenCalled();
    });
  });

  describe('deleteUserByEmail', () => {
    it('should delete user when email exists', async () => {
      const email = 'test1@example.com';
      const expectedResponse = {
        status: 200,
        message: `User with email ${email} has been deleted`,
      };

      mockUsersService.deleteUserByEmail.mockResolvedValue(expectedResponse);

      const result = await controller.deleteUserByEmail(email);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.deleteUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw NotFoundException when email does not exist', async () => {
      const email = 'nonexistent@example.com';
      mockUsersService.deleteUserByEmail.mockRejectedValue(
        new NotFoundException(`User with id ${email} not found`),
      );

      try {
        await controller.deleteUserByEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`User with id ${email} not found`);
      }

      expect(mockUsersService.deleteUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('updateUsernameByEmail', () => {
    it('should update username when email exists', async () => {
      const email = 'test1@example.com';
      const newUsername = 'newUsername';
      const updatedUser = {
        ...mockUsers[0],
        username: newUsername,
      };

      const expectedResponse = {
        status: 200,
        message: `User with email ${email} has been updated`,
        updatedUser,
      };

      mockUsersService.updateUsernameByEmail.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.updateUsernameByEmail(email, newUsername);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.updateUsernameByEmail).toHaveBeenCalledWith(
        email,
        newUsername,
      );
    });

    it('should throw NotFoundException when email does not exist', async () => {
      const email = 'nonexistent@example.com';
      const newUsername = 'newUsername';

      mockUsersService.updateUsernameByEmail.mockRejectedValue(
        new NotFoundException(`User with id ${email} not found`),
      );

      try {
        await controller.updateUsernameByEmail(email, newUsername);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`User with id ${email} not found`);
      }

      expect(mockUsersService.updateUsernameByEmail).toHaveBeenCalledWith(
        email,
        newUsername,
      );
    });

    it('should throw BadRequestException when email or username is missing', async () => {
      mockUsersService.updateUsernameByEmail.mockRejectedValue(
        new BadRequestException('Email and username are required for update'),
      );

      try {
        await controller.updateUsernameByEmail('', '');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Email and username are required for update',
        );
      }
    });
  });
});
