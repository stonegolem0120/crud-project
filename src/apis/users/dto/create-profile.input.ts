import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class CreateUserProfileInput {
  @Field(() => String)
  nickName: string;

  @Field(() => String, { nullable: true })
  decs: string | null;
}
