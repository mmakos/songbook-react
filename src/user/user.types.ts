export interface IUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  type?: UserType;
}

export enum UserType {
  SITH = 'Sith',
  JEDI = 'Jedi',
  DROID = 'Droid',
  CLONE = 'Clone',
}

export interface ILoginResponse {
  access: string;
  user: IUser;
}

export interface IUserResponse {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
