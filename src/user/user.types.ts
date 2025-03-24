export interface IUser {
  username: string;
  type: UserType;
}

export enum UserType {
  OWNER = 'owner',
  BOT = 'bot',
  VERIFIED = 'verified',
  NORMAL = 'user',
}