import { Field, Int, ObjectType } from '@nestjs/graphql';
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
export class Like {
  //uuid
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  //username
  @Column()
  @Field(() => String)
  userId: string;

  @Column()
  @Field(() => String)
  postId: string;

  // @Column()
  // @Field(() => String)
  // file: string;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) // Add this decorator for updatedAt timestamp
  updatedAt: Date;
}
