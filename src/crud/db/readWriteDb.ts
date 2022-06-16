import { dirname, resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { IUser } from '../create';

const dbPath = resolve(dirname(process.argv[1]), './crud/db', 'users.json');

export const read = async (userId: string) => {
  try {
    const users = String(await readFile(dbPath));
    if (userId) {
      return JSON.parse(users).filter((user: IUser) => user.id === userId)[0];
    }
    return JSON.parse(users);
  } catch (e) {
    console.error(e);
  }
};

export const write = async (newData: string) => {
  try {
    await writeFile(dbPath, newData);
  } catch (e) {
    console.error(e);
  }
};
