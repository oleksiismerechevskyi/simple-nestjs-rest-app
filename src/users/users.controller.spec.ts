import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUsersService = () => ({
  findUser: jest.fn(),
  findUserByUsername: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn(),
  updateTask: jest.fn(),
  getAllUsers: jest.fn(),
});

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: ReturnType<typeof mockUsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useFactory: mockUsersService }],
    }).compile();

    usersService = module.get(UsersService);
    usersController = module.get(UsersController);
  });

  describe('getUsers', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    it('should return tasks', async () => {
      usersService.getAllUsers.mockResolvedValueOnce([mockUser]);
      const result = await usersController.getUsers();
      expect(result).toEqual([mockUser]);
    });

    it('should return empty array', async () => {
      usersService.getAllUsers.mockResolvedValueOnce([]);
      const result = await usersController.getUsers();
      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    it('should return a user', async () => {
      usersService.findUser.mockResolvedValueOnce(mockUser);
      const result = await usersController.getUserById(
        'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return an error', async () => {
      usersService.findUser.mockResolvedValueOnce(null);
      try {
        await usersController.getUserById('someid');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteUser', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    it('should return deleted user', async () => {
      usersService.deleteUser.mockReturnValue(mockUser);
      const result = await usersController.deleteUser(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    const updateUserDto: UpdateUserDto = {
      username: 'mockTest',
      password: '123456',
    };

    it('should return updated task', async () => {
      usersService.updateUser.mockReturnValue(mockUser);
      const result = await usersController.updateUser(mockUser, updateUserDto);
      expect(result).toEqual(mockUser);
    });
  });
});
