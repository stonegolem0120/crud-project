import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/Comment.entity';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PostModule } from '../posts/post.module';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';
import { PostService } from '../posts/post.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Post } from '../posts/entities/post.entity';
import { secretKey } from 'src/commons/secret/jwtSecretKey';
import { FileModule } from '../fileUpload/upload.module';
import { FileService } from '../fileUpload/upload.service';
import { UsersModule } from '../users/user.module';
import { FileEntity } from '../fileUpload/entities/upload.entity';
import { GraphQLUpload } from 'graphql-upload-ts';
import { CassandraService } from 'src/cassandra/cassandra.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Post, FileEntity]),
    JwtModule.register({
      secret: secretKey,
    }),
    PostModule,
    AuthModule,
    UsersModule,
    FileModule,
  ],
  providers: [
    CommentService,
    CommentResolver,
    AuthService,
    JwtModule,
    AuthModule,
    PostService,
    CassandraService,
    UserService,
    FileService,
  ],
})
export class CommentModule {}
