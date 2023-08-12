import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPostAuthTokenService,
  IPostServiceCreate,
  IPostServiceDelete,
  IPostServiceFindOne,
  IPostServiceUpdate,
} from './interfaces/createPostService.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>, //
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly authService: AuthService, //
  ) {}

  async findAll(page: number, pageSize: number): Promise<Post[]> {
    const skip = (page - 1) * pageSize;
    return this.postRepository.find({
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
  }

  findOne({ postId }: IPostServiceFindOne): Promise<Post> {
    const options: FindOneOptions<Post> = {
      where: { id: postId },
    };
    return this.postRepository.findOne(options);
  }

  async findCount(): Promise<number> {
    return this.postRepository.count();
  }

  async create({ createPostInput, token }: IPostServiceCreate): Promise<Post> {
    const userName = await this.authToken({ token });
    const post = {
      ...createPostInput,
      userName,
    };

    return this.postRepository.save(post);
  }

  async update({
    token,
    postId,
    updatePostInput,
  }: IPostServiceUpdate): Promise<Post> {
    const userName = await this.authToken({ token });
    const post = await this.findOne({ postId });
    if (post.userName != userName)
      throw new ConflictException('글쓴사람이 아닙니다');

    return await this.postRepository.save({
      ...post,
      ...updatePostInput, //
    });
  }

  async delete({ token, postId }: IPostServiceDelete): Promise<boolean> {
    const userName = await this.authToken({ token });
    const post = await this.findOne({ postId });
    if (post.userName != userName)
      throw new ConflictException('글쓴사람이 아닙니다');

    const result = await this.postRepository.softDelete({
      id: postId,
    }); // 단점: 여러ID 지우기 불가능
    return result.affected ? true : false;
    //                                                      // 장점: 다른 컴럼으로도 삭제가능
  }

  async authToken({ token }: IPostAuthTokenService): Promise<string> {
    const isTokenValid = await this.authService.verifyToken(token);
    const decodedToken = this.jwtService.decode(token) as { sub: string };

    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    // const decodedToken = this.jwtService.decode(token) as { sub: string };
    const result = decodedToken.sub;
    return result;
  }
}
