import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User, UserProfile } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserProfileInput } from './dto/create-profile.input';

@Resolver()
export class UserResolver {
  constructor(
    private readonly usersService: UserService, //
  ) {}
  @Query(() => UserProfile)
  async fetchUserProfile(
    @Args('userId') userId: string, //
  ): Promise<UserProfile> {
    return this.usersService.fetchProfile({
      userId,
    });
  }

  @Mutation(() => User)
  createUser(
    @Args('userId') userId: string,
    @Args('password') password: string,
    @Args('createUserProfileInput')
    createUserProfileInput: CreateUserProfileInput,
  ): Promise<User> {
    return this.usersService.create({
      userId,
      password,
      createUserProfileInput,
    });
  }
}
