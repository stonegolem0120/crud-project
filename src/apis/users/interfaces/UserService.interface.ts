import { CreateUserProfileInput } from '../dto/create-profile.input';
// import { FileUpload } from 'src/apis/posts/interfaces/createPostService.interface';
import { ReadStream } from 'fs';

export interface IUsersServiceFindOneByUserId {
  userId: string;
}
export interface IUsersServiceCreate {
  userId: string;
  createUserProfileInput: CreateUserProfileInput;
  password: string;
}
export interface IUsersServiceUploadFile {
  file: FileUpload;
}
export interface IUserServiceFetchProfile {
  userId: string;
}
export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}
export interface CustomFileUpload extends FileUpload {
  fieldName: string;
}
