import { readFile, writeFile } from 'fs/promises';
import { IUser } from '../utils/user';
import { dbPath } from './createDb';
import { IRes } from '../read';
import { contType } from '../../index';
import { setError } from '../utils/response';
import { serverError } from '../../index';

export const read = async (userId: string, res: IRes) => {
  try {
    const users = String(await readFile(dbPath));
    if (userId) {
      return JSON.parse(users).filter((user: IUser) => user.id === userId)[0];
    }
    return JSON.parse(users);
  } catch {
    res.writeHead(500, contType);
    res.end(setError(serverError));
  }
};

export const write = async (newData: string, res: IRes) => {
  try {
    await writeFile(dbPath, newData);
  } catch {
    res.writeHead(500, contType);
    res.end(setError(serverError));
  }
};
