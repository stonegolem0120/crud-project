import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class updatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;
}
