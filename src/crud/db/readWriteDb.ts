import { dirname, resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { IUser } from '../create';

const dbPath = resolve(dirname(process.argv[1]), './crud/db', 'users.json');

export const read = async (id: string) => {
  try {
    const users = String(await readFile(dbPath));
    if (id) {
      return JSON.parse(users).filter((user: IUser) => user.id === id)[0];
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
