import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigModule } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

const mockUserService = () => ({
  findUserByUsername: jest.fn(),
});

describe('Jwt strategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService: ReturnType<typeof mockUserService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(async () => ({
          JWT_SECRET: 'any_value',
        })),
      ],
      providers: [
        JwtStrategy,
        UsersService,
        { provide: UsersService, useFactory: mockUserService },
      ],
    }).compile();

    jwtStrategy = module.get(JwtStrategy);
    usersService = module.get(UsersService);
  });

  describe('validate', () => {
    const mockJwtPayload: JwtPayload = { username: 'Oleksii' };
    const mockUser = {
      id: '3',
      username: 'Oleksii',
      password: 'qwerty12345',
      tasks: [],
    };

    it('should return a user', () => {
      usersService.findUserByUsername.mockReturnValueOnce(mockUser);
      const result = jwtStrategy.validate(mockJwtPayload);
      expect(result).resolves.toEqual(mockUser);
    });

    it('should throw an unauthorized error', async () => {
      usersService.findUserByUsername.mockReturnValueOnce(null);
      try {
        await jwtStrategy.validate(mockJwtPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
