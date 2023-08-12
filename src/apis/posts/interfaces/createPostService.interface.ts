import { createPostInput } from '../dto/create-post.input';
import { updatePostInput } from '../dto/update-post.input';
import { Stream } from 'stream';

export interface IPostServiceCreate {
  createPostInput: createPostInput;
  token: string;
}
export interface IPostServiceUpdate {
  token: string;
  postId: string;
  updatePostInput: updatePostInput;
}
export interface IPostServiceFindOne {
  postId: string;
}
export interface IPostServiceDelete {
  token: string;
  postId: string;
}
export interface IPostAuthTokenService {
  token: string;
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
