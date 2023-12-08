import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CryptoService } from 'src/utility/crypto.service';
import { UtilityModule } from 'src/utility/utility.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersService, UsersRepository, CryptoService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    UtilityModule,
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
