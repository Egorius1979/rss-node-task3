import { IUser } from './user';

export const setError = (message: string) => {
  return JSON.stringify({ message });
};

export const setResponse = (data: IUser | IUser[]) => {
  return JSON.stringify(data);
};
