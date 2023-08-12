import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../users/user.service'; // UserService 임포트
import { User } from '../users/entities/user.entity';
import { secretKey } from 'src/commons/secret/jwtSecretKey';
import { FileEntity } from '../fileUpload/entities/upload.entity';
import { FileService } from '../fileUpload/upload.service';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { PostService } from '../posts/post.service';
import { PostModule } from '../posts/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, FileEntity, Like]),
    JwtModule.register({
      secret: secretKey,
    }),
    AuthModule,
    PostModule,
    // TypeOrmModule.forFeature([User]), // UserService의 의존성을 해결하기 위해 User 엔티티를 임포트
  ],
  providers: [
    LikeResolver,
    LikeService,
    JwtModule,
    FileService,
    CassandraService,
    AuthService,
    PostService,
    UserService, // UserService를 providers에 추가
  ],
})
export class LikeModule {}
