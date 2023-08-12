import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './upload.service';
import { FileEntity } from './entities/upload.entity';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { FileResolver } from './upload.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileService, FileResolver, CassandraService],
})
export class FileModule {}
