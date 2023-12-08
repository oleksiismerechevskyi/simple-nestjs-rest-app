import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  private repository: Repository<User>;

  constructor(@InjectRepository(User) rep: Repository<User>) {
    super(rep.target, rep.manager, rep.queryRunner);
    this.repository = rep;
  }

  public async createUser(dto: CreateUserDto): Promise<User> {
    const { username, password } = dto;
    const user = this.create({
      username,
      password,
    });
    await this.save(user);
    return user;
  }
}
