import { User } from 'src/apis/users/entities/user.entity';

export interface IAuthServiceLogin {
  userId: string;
  password: string;
}
export interface IAuthServiceGetAccessToken {
  userResult: User;
}
export interface IAuthServiceTokenCheck {
  token: string;
}
