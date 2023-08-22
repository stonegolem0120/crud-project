import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Comment } from './entities/Comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ICommentAuthTokenService,
  ICommentServiceCreate,
  ICommentServiceDelete,
  ICommentServiceFindAllByComment,
  ICommentServiceFindOneByComment,
  ICommentServiceUpdate,
} from './interfaces/createCommentService.interface';
import { PostService } from '../posts/post.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class CommentService {
  constructor(
    // @InjectRepository(Post)
    // private readonly postRepository: Repository<Post>, //
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>, //
    private readonly postService: PostService, //
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }
  public pubSub: PubSub = new PubSub();
  async findAllByComment({
    postId,
  }: ICommentServiceFindAllByComment): Promise<Comment[]> {
    const post = await this.postService.findOne({ postId });
    if (!post) throw new ConflictException('존재하지 않는 글입니다');

    const result = await this.commentRepository.find({ where: { postId } });
    if (!result) throw new ConflictException('존재하지 않는 글입니다');

    return result;
  }
  findOneByComment({
    commentId,
  }: ICommentServiceFindOneByComment): Promise<Comment> {
    const result = this.commentRepository.findOne({ where: { id: commentId } });
    if (!result) throw new ConflictException('존재하지 않는 글입니다');

    return result;
  }

  async create({
    createCommentInput, //
    token,
  }: ICommentServiceCreate): Promise<Comment> {
    // const userName = await this.authToken({ token });
    const userName = await this.authToken({ token });
    const post = await this.postService.findOne({
      postId: createCommentInput.postId,
    });
    if (!post) throw new ConflictException('존재하지 않는 글입니다');
    const comment = await this.commentRepository.save({
      ...createCommentInput,
      userName,
    });
    this.pubSub.publish('commentAdded', { commentAdded: comment });
    return comment;
  }

  async update({
    token,
    commentId,
    updateCommentInput,
  }: ICommentServiceUpdate): Promise<Comment> {
    // const isTokenValid = this.authService.verifyToken(token);
    // if (!isTokenValid) {
    //   throw new UnauthorizedException('Invalid token');
    // }
    // const decodedToken = this.jwtService.decode(token) as { sub: string };
    // const userName = decodedToken.sub;
    const userName = await this.authToken({ token });
    const comment = await this.findOneByComment({ commentId });
    if (comment.userName != userName)
      throw new ConflictException('댓글쓴사람이 아닙니다');

    return await this.commentRepository.save({
      ...comment,
      ...updateCommentInput, //
    });
  }
  async delete({ token, commentId }: ICommentServiceDelete): Promise<boolean> {
    // const isTokenValid = this.authService.verifyToken(token);
    // if (!isTokenValid) {
    //   throw new UnauthorizedException('Invalid token');
    // }
    // const decodedToken = this.jwtService.decode(token) as { sub: string };
    // const userName = decodedToken.sub;
    const comment = await this.findOneByComment({ commentId });
    const userName = await this.authToken({ token });
    if (comment.userName != userName)
      throw new ConflictException('댓글쓴사람이 아닙니다');

    const result = await this.commentRepository.softDelete({
      id: commentId,
    }); // 단점: 여러ID 지우기 불가능
    return result.affected ? true : false;
  }
  async authToken({ token }: ICommentAuthTokenService): Promise<string> {
    console.log(token);
    const isTokenValid = await this.authService.verifyToken(token);
    const decodedToken = this.jwtService.decode(token) as { sub: string };
    console.log(isTokenValid);
    console.log(decodedToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    // const decodedToken = this.jwtService.decode(token) as { sub: string };
    const result = decodedToken.sub;
    return result;
  }
}
