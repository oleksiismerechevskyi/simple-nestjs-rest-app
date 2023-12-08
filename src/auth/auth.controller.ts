import {
  Controller,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CryptoService } from '../utility/crypto.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
  ) {}

  @Post('/signup')
  public async signUp(@Body() dto: CreateUserDto): Promise<User> {
    const user = await this.usersService.findUserByUsername(dto.username);
    if (user) {
      throw new ConflictException('Username already exists');
    }
    return this.usersService.createUser(dto);
  }
  @Post('/signin')
  public async signIn(@Body() dto: CreateUserDto): Promise<object> {
    const { username, password } = dto;
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User doesn't exist`);
    }

    if (!(await this.cryptoService.bcryptCompare(password, user.password))) {
      throw new BadRequestException(`Password doesn't exist`);
    }

    return this.service.signIn(username);
  }
}
