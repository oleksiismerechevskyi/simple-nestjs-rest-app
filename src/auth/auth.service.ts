import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private userService: UsersService;
  private jwtService: JwtService;

  constructor(userService: UsersService, jwt: JwtService) {
    this.userService = userService;
    this.jwtService = jwt;
  }

  public async register(dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  public async signIn(username: string): Promise<object> {
    const payload: JwtPayload = { username };
    const accessToken: string = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
