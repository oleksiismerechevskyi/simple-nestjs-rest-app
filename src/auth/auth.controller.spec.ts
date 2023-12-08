import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { CryptoService } from '../utility/crypto.service';
import { PassportModule } from '@nestjs/passport';

const mockUsersService = () => ({
  createUser: jest.fn(),
  findUserByUsername: jest.fn(),
});

const mockAuthService = () => ({
  signIn: jest.fn(),
  register: jest.fn(),
});

const mockCryptoService = () => ({
  bcryptCompare: jest.fn(),
});

describe('AuthController', () => {
  let authController: AuthController;
  let authService: ReturnType<typeof mockAuthService>;
  let usersService: ReturnType<typeof mockUsersService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useFactory: mockAuthService },
        JwtService,
        { provide: UsersService, useFactory: mockUsersService },
        { provide: CryptoService, useFactory: mockCryptoService },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    authController = module.get(AuthController);
    cryptoService = module.get(CryptoService);
  });

  describe('signUp', () => {
    const mockCreateUserDto: CreateUserDto = {
      username: 'Oleksii',
      password: 'qwerty12345',
    };

    const mockUser: User = {
      id: '3',
      username: 'Oleksii',
      password: 'qwerty12345',
      tasks: [],
    };

    it('should return created user', async () => {
      authService.register.mockReturnValueOnce(mockUser);
      usersService.createUser.mockReturnValueOnce(mockUser);
      const result = await authController.signUp(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error', async () => {
      usersService.findUserByUsername.mockReturnValueOnce(null);
      authService.register.mockReturnValueOnce(mockUser);
      try {
        await authController.signUp(mockCreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('signIn', () => {
    const mockCreateUserDto: CreateUserDto = {
      username: 'Oleksii',
      password: 'qwerty12345',
    };

    const mockUser: User = {
      id: '3',
      username: 'Oleksii',
      password: 'qwerty12345',
      tasks: [],
    };

    const mockAccessToken = {
      accessToken: 'accessToken',
    };

    it('should return jwt token', async () => {
      usersService.findUserByUsername.mockReturnValueOnce(mockUser);
      authService.signIn.mockReturnValueOnce(mockAccessToken);
      cryptoService.bcryptCompare.mockReturnValueOnce('encrypted');
      const result = await authController.signIn(mockCreateUserDto);
      expect(result).toEqual(mockAccessToken);
    });

    it('should throw conflict exception', async () => {
      usersService.findUserByUsername.mockReturnValueOnce(mockUser);
      authService.signIn.mockReturnValueOnce(
        new ConflictException('Username already exists'),
      );
      cryptoService.bcryptCompare.mockReturnValueOnce('encrypted');
      const result = await authController.signIn(mockCreateUserDto);
      expect(result).toBeInstanceOf(ConflictException);
    });
  });
});
