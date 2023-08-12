import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/Comment.entity';
import { createCommentInput } from './dto/create-comment.input';
import { updateCommentInput } from './dto/update-comment.input';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}
  @Query(() => [Comment])
  fetchComments(
    @Args('postId') postId: string, //
  ): Promise<Comment[]> {
    return this.commentService.findAllByComment({ postId });
  }

  @Query(() => Comment)
  fetchComment(
    @Args('commentId') commentId: string, //
  ): Promise<Comment> {
    return this.commentService.findOneByComment({ commentId });
  }

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: createCommentInput,
    @Args('token') token: string,
  ): Promise<Comment> {
    return this.commentService.create({ createCommentInput, token });
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('token') token: string,
    @Args('commentId') commentId: string,
    @Args('updateCommentInput') updateCommentInput: updateCommentInput, //
  ): Promise<Comment> {
    return this.commentService.update({
      token,
      commentId,
      updateCommentInput,
    });
  }
  @Mutation(() => Boolean)
  deleteComment(
    @Args('token') token: string,
    @Args('commentId') commentId: string,
  ): Promise<boolean> {
    return this.commentService.delete({ token, commentId });
  }
}
