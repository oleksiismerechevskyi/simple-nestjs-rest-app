import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { UtilityModule } from 'src/utility/utility.module';
import { CryptoService } from 'src/utility/crypto.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersRepository, CryptoService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({}),
    ConfigModule,
    UsersModule,
    UtilityModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: 3600,
          },
        };
      },
    }),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
