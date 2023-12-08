import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  public async getUserById(@Param('id') id: string): Promise<User> {
    const user = this.userService.findUser(id);
    if (!user) {
      throw new NotFoundException(`User doesn't exist`);
    }
    return user;
  }

  @Delete()
  public async deleteUser(@GetUser() user: User): Promise<User> {
    return this.userService.deleteUser(user.id);
  }

  @Patch()
  public updateUser(
    @GetUser() user: User,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(user.id, dto);
  }
}
