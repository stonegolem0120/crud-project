import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './upload.service';
import { FileEntity } from './entities/upload.entity';
import { FileUpload, GraphQLUpload, Upload } from 'graphql-upload-ts';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: any,
  ): Promise<string> {
    return await this.fileService.uploadFile({ file });
  }
}
