import { Field, ObjectType } from '@nestjs/graphql';
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
export class Comment {
  //comment-uuid
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  //user-name
  @Column()
  @Field(() => String)
  userName: string;

  @Column()
  @Field(() => String)
  postId: string;

  @Column()
  @Field(() => String)
  content: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  // @Field()
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  // @Field()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  // @Field({ nullable: true })
  deletedAt?: Date | null;
}
// @Entity()
// @ObjectType()
// export class Comment {
//   @PrimaryGeneratedColumn('uuid')
//   @Field(() => String)
//   id: string;

//   @Column()
//   @Field(() => String)
//   postId: string;

//   @Column()
//   @Field(() => String)
//   content: string;

//   @CreateDateColumn({ name: 'create_at', comment: '생성일' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
//   updatedAt: Date;

//   @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
//   deletedAt?: Date | null;
// }
