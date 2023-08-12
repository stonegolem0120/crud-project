import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { createPostInput } from './dto/create-post.input';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}
  @Query(() => [Post])
  async fetchPosts(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<Post[]> {
    return this.postService.findAll(page, pageSize);
  }

  @Query(() => Post)
  async fetchPostbyPostId(
    @Args('postID') postId: string, //
  ): Promise<Post> {
    return this.postService.findOne({ postId });
  }

  @Query(() => Number)
  async fetchPostCount(): Promise<number> {
    return this.postService.findCount();
  }

  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: createPostInput, //
    @Args('token') token: string,
  ): Promise<Post> {
    return this.postService.create({ createPostInput, token });
  }

  @Mutation(() => Post)
  updatePost(
    @Args('token') token: string,
    @Args('postId') postId: string,
    @Args('updatePostInput') updatePostInput: createPostInput, //
  ): Promise<Post> {
    return this.postService.update({ token, postId, updatePostInput });
  }
  @Mutation(() => Boolean)
  deletePost(
    @Args('token') token: string,
    @Args('postId') postId: string, //
  ): Promise<boolean> {
    return this.postService.delete({ token, postId });
  }
}
