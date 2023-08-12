import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Mutation(() => String)
  login(
    @Args('userId') userId: string,
    @Args('password') password: string, //
  ): Promise<string> {
    return this.authService.login({ userId, password });
  }
  @Query(() => User)
  async tokenChecking(
    @Args('token') token: string, //
  ): Promise<User> {
    return this.authService.checkToken({ token });
  }
}
