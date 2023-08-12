import { Field, InputType } from '@nestjs/graphql';
import { DeepPartial } from 'typeorm';

@InputType()
export class createCommentInput {
  @Field(() => String)
  postId: string;

  @Field(() => String)
  content: string;
}
// export type createCommentInput = DeepPartial<Comment>;
