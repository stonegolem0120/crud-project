import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { PostService } from '../posts/post.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly jwtService: JwtService,
    private readonly postService: PostService,
  ) {}
  async getTotalLikesByPostId(postId: string): Promise<number> {
    const like = await this.likeRepository.count({
      where: { postId, like: 1 },
    });
    return like;
  }

  async fetchUserLike({ postId, token }): Promise<Like> {
    const userId = this.verifyTokenAndGetUserId(token);
    console.log(userId);
    const existingPost = await this.postService.findOne({ postId });
    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    // 사용자 ID와 포스트 ID를 기반으로 해당 사용자의 라이크 정보를 찾음
    const existingLike = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    if (!existingLike) {
      // 좋아요를 누른 적이 없는 경우, null 대신 예외를 던짐
      throw new NotFoundException('Like not found');
    }

    // 좋아요 정보가 있을 경우 해당 Like 객체를 반환
    console.log(existingLike);
    return existingLike;
  }

  async toggleLike({ postId, token }): Promise<Like> {
    // Verify token and extract user ID (sub) from it
    const userId = this.verifyTokenAndGetUserId(token);

    // Check if the post with the given postId exists
    const existingPost = await this.postService.findOne({ postId });
    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    // Check if the like for the user and post already exists
    const existingLike = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    if (!existingLike) {
      // If the like doesn't exist, create a new Like instance with like=1 and save it.
      const newLike = this.likeRepository.create({
        id: uuidv4(),
        userId,
        postId,
        like: 1,
      });
      await this.likeRepository.save(newLike);
      return newLike;
    }

    // Calculate the time difference between the last update and now in seconds.
    const timeDifferenceInSeconds = Math.floor(
      (Date.now() - existingLike.updatedAt.getTime()) / 1000,
    );

    // If the time difference is less than 1 second, it's considered a quick click, so don't perform the action.
    if (timeDifferenceInSeconds < 1) {
      return existingLike;
    }

    // Toggle the like status (liked or unliked) and update the updatedAt timestamp.
    existingLike.like = existingLike.like === 0 ? 1 : 0;
    await this.likeRepository.save(existingLike);

    return existingLike;
  }

  private verifyTokenAndGetUserId(token: string): string {
    try {
      const decodedToken = this.jwtService.verify(token);
      const userId = decodedToken.sub;
      if (!userId) {
        throw new UnauthorizedException('Invalid token');
      }
      return userId;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
