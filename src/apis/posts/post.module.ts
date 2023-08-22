import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../users/user.service'; // UserService 임포트
import { User } from '../users/entities/user.entity';
import { secretKey } from 'src/commons/secret/jwtSecretKey';
import { FileEntity } from '../fileUpload/entities/upload.entity';
import { FileService } from '../fileUpload/upload.service';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { PubSub } from 'graphql-subscriptions';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, FileEntity]),
    JwtModule.register({
      secret: secretKey,
    }),
    AuthModule,
    // TypeOrmModule.forFeature([User]), // UserService의 의존성을 해결하기 위해 User 엔티티를 임포트
  ],
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
    PostService,
    PostResolver,
    JwtModule,
    FileService,
    CassandraService,
    AuthService,
    UserService, // UserService를 providers에 추가
  ],
  exports: [PostService],
})
export class PostModule {}
