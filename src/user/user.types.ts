export interface IUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  type: UserType;
}

export enum UserType {
  OWNER = 'owner',
  BOT = 'bot',
  VERIFIED = 'verified',
  NORMAL = 'user',
}

export interface ILoginResponse {
  access: string;
  user: IUserResponse;
}

export interface IUserResponse {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const mapResponseToUser = (response: IUserResponse): IUser => {
  return {
    username: response.username,
    firstName: response.first_name,
    lastName: response.last_name,
    email: response.email,
    type: UserType.NORMAL,
  };
};
