import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/commons/secret/jwtSecretKey';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      // secret: '3hndsuxj34d7#@$%',
      secret: secretKey,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  providers: [
    AuthResolver,
    AuthService, //
  ],
  exports: [
    AuthService, //
  ],
})
export class AuthModule {}
