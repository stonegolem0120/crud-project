import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { FileModule } from '../fileUpload/upload.module';
import { FileService } from '../fileUpload/upload.service';
import { FileEntity } from '../fileUpload/entities/upload.entity';
import { CassandraService } from 'src/cassandra/cassandra.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FileEntity]),
    FileModule, // FileModule을 imports 배열에 추가
  ],
  providers: [
    UserResolver,
    UserService,
    FileService,
    CassandraService, //
  ],
  exports: [UserService],
})
export class UsersModule {}
