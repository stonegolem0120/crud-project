// import { Injectable, UnprocessableEntityException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import {
//   IAuthServiceGetAccessToken,
//   IAuthServiceLogin,
// } from './interfaces/authService.interfaces';
// import { User } from '../users/entities/user.entity';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { UserService } from '../users/user.service';
// @Injectable()
// export class AuthSevice {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly usersService: UserService,
//   ) {}
//   async login({ userId, password }: IAuthServiceLogin): Promise<string> {
//     //1.이메일이 일치하느  유저를 db에서 찾기
//     const userResult = await this.usersService.findOneByEmail({ userId });
//     if (!userResult)
//       throw new UnprocessableEntityException('회원가입을 해주세요.');
//     const isAuth = await bcrypt.compare(password, userResult.password);
//     if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');
//     //4.일치하고 비밀번호도 맞으면?
//     // ->jwttoken
//     return this.getAccessToken({ userResult });
//   }
//   getAccessToken({ userResult }: IAuthServiceGetAccessToken): string {
//     return this.jwtService.sign({ sub: userResult.id });
//   }
//   verifyToken(token: string): boolean {
//     try {
//       const decodedToken = this.jwtService.verify(token);
//       return true; // 토큰이 유효한 경우
//     } catch (error) {
//       return false; // 토큰이 유효하지 않은 경우
//     }
//   }
// }
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // JwtService 추가
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
  IAuthServiceTokenCheck,
} from './interfaces/authService.interfaces';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, // JwtService 주입
    private readonly usersService: UserService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async login({ userId, password }: IAuthServiceLogin): Promise<string> {
    const userResult = await this.usersService.findOneByEmail({ userId });
    if (!userResult) {
      throw new UnprocessableEntityException('회원가입을 해주세요.');
    }
    const isAuth = await bcrypt.compare(password, userResult.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('암호가 틀렸습니다.');
    }
    return this.getAccessToken({ userResult });
  }

  getAccessToken({ userResult }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign({ sub: userResult.id });
  }

  verifyToken(token: string): boolean {
    try {
      const decodedToken = this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
  async checkToken({ token }: IAuthServiceTokenCheck): Promise<User> {
    const userId = this.verifyTokenAndGetUserId(token);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    return user;
  }

  private verifyTokenAndGetUserId(token: string): string {
    try {
      const decodedToken = this.jwtService.verify(token);
      const userId = decodedToken.sub;
      if (!userId) {
        throw new UnauthorizedException('Invalid token');
      }
      return userId;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
