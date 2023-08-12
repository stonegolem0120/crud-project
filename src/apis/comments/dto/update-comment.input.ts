import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class updateCommentInput {
  @Field(() => String)
  postId: string;

  @Field(() => String)
  content: string;
}
