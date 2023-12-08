import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from '../utility/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.cryptoService.generateHashedPassword(
      dto.password,
    );
    return this.repository.createUser({ ...dto, password: hashedPassword });
  }

  public async findUser(id: string): Promise<User | null> {
    const user: User = await this.repository.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    const user: User = await this.repository.findOne({
      where: {
        username,
      },
    });

    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    return this.repository.find();
  }

  public async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findUser(id);
    user.username = dto.username ?? user.username;
    if (dto.password) {
      user.password = await this.cryptoService.generateHashedPassword(
        dto.password,
      );
    }
    return await this.repository.save(user);
  }

  public async deleteUser(id: string): Promise<User> {
    const user = await this.findUser(id);
    await this.repository.delete(user);
    return user;
  }
}
