import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLUpload, Upload } from 'graphql-upload-ts';
import { FileUpload } from 'src/apis/posts/interfaces/createPostService.interface';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Field(() => String)
  @Column()
  userId: string;

  // @Field(() => String)
  @Column()
  password: string;

  // @Field(() => Upload, { nullable: true })
  // @Column({ nullable: true })
  // profileImage: Promise<Upload>;
  @Field(() => String)
  @Column()
  userName: string;

  @Field(() => String)
  @Column({ nullable: true, default: null })
  userDecs: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;
}

@ObjectType()
export class UserProfile {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  @Column()
  userName: string;

  @Field(() => String)
  @Column({ nullable: true, default: null })
  userDecs: string | null;
}
