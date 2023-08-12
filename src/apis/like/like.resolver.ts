import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { Like } from './entities/like.entity';
import { LikeService } from './like.service';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Query(() => Int)
  async likesByPostId(@Args('postId') postId: string): Promise<number> {
    return this.likeService.getTotalLikesByPostId(postId);
  }

  @Query(() => Like)
  async fetchLike(
    @Args('token') token: string,
    @Args('postId') postId: string,
  ): Promise<Like> {
    return this.likeService.fetchUserLike({ postId, token });
  }

  @Mutation(() => Like)
  async toggleLike(
    @Args('token') token: string,
    @Args('postId') postId: string,
  ): Promise<Like> {
    return this.likeService.toggleLike({ postId, token });
  }
}
