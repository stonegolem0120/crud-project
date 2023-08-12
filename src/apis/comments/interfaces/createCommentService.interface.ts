import { DeepPartial } from 'typeorm';
import { createCommentInput } from '../dto/create-comment.input';
import { updateCommentInput } from '../dto/update-comment.input';

export interface ICommentServiceCreate {
  token: string;
  createCommentInput: createCommentInput;
}
// interface ICommentServiceCreate {
//   createCommentInput: DeepPartial<Comment>;
//   // ...
// }

export interface ICommentServiceUpdate {
  token: string;
  commentId: string;
  updateCommentInput: updateCommentInput;
}
export interface ICommentServiceFindOne {
  postId: string;
}
export interface ICommentServiceDelete {
  token: string;
  commentId: string;
}
export interface ICommentServiceFindAllByComment {
  postId: string;
}
export interface ICommentServiceFindOneByComment {
  commentId: string;
}
export interface ICommentAuthTokenService {
  token: string;
}
