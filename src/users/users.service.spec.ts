import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUsers = [
    { id: 1, email: 'user1@test.com', username: 'user1' },
    { id: 2, email: 'user2@test.com', username: 'user2' },
    { id: 3, email: 'user3@test.com', username: 'user3' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users when no limit is provided', async () => {
      // Arrange
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      // Act
      const result = await service.getUsers();

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual({
        totalCount: mockUsers.length,
        users: mockUsers,
      });
    });

    it('should return limited users when limit is provided', async () => {
      // Arrange
      const limit = 2;
      const limitedUsers = mockUsers.slice(0, limit);
      mockPrismaService.user.findMany.mockResolvedValue(limitedUsers);

      // Act
      const result = await service.getUsers(limit);

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        take: limit,
      });
      expect(result).toEqual({
        totalCount: limitedUsers.length,
        users: limitedUsers,
      });
    });

    it('should handle empty result', async () => {
      // Arrange
      mockPrismaService.user.findMany.mockResolvedValue([]);

      // Act
      const result = await service.getUsers();

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual({
        totalCount: 0,
        users: [],
      });
    });

    it('should handle prisma errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockPrismaService.user.findMany.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getUsers()).rejects.toThrow('Database error');
    });
  });
});
