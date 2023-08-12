import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserProfile } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from 'graphql-upload-ts';
import { FileService } from '../fileUpload/upload.service';
import { CassandraService } from 'src/cassandra/cassandra.service';
import * as bcrypt from 'bcrypt';
import {
  IUserServiceFetchProfile,
  IUsersServiceCreate,
  IUsersServiceFindOneByUserId,
} from './interfaces/UserService.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly fileService: FileService,
    private readonly cassandraService: CassandraService,
  ) {}
  async fetchProfile({
    userId,
  }: IUserServiceFetchProfile): Promise<UserProfile> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      // 유저를 찾지 못한 경우에 대한 처리
      throw new Error('User not found');
    }

    const userProfile = {
      userId: user.userId,
      userName: user.userName,
      userDecs: user.userDecs,
    };

    return userProfile;
  }

  async create({
    createUserProfileInput,
    userId,
    password,
  }: IUsersServiceCreate): Promise<User> {
    const user = await this.findOneByEmail({ userId });
    if (user) throw new ConflictException('이미 가입된 계정이 있습니다.');

    const { nickName, decs } = createUserProfileInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.userId = userId;
    newUser.password = hashedPassword;
    newUser.userName = nickName;
    newUser.userDecs = decs;

    await this.usersRepository.save(newUser);

    return newUser;
  }

  async findOneByEmail({
    userId,
  }: IUsersServiceFindOneByUserId): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { userId } });
  }

  async uploadProfileImage(profileImage: FileUpload): Promise<string> {
    return await this.fileService.uploadFile({
      file: profileImage,
    });
    this.fetchProfile;
  }
}
