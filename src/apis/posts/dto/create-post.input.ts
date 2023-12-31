import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createPostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;
}
