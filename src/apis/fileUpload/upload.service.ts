import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { IFileServiceUploadFile } from './interfaces/uploadfile.interface';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class FileService {
  constructor(private readonly cassandraService: CassandraService) {}

  async uploadFile({ file }: IFileServiceUploadFile): Promise<string> {
    const fileId = uuidv4();
    const { createReadStream, filename, mimetype, encoding }: FileUpload = file;
    const fileStream: ReadStream = createReadStream();
    await this.cassandraService.saveFile(
      fileId,
      fileStream,
      filename,
      mimetype,
      encoding,
    );
    return fileId;
  }
}
