import { writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { access } from 'fs/promises';

export const dbPath = resolve(
  dirname(process.argv[1]),
  './crud/db',
  'users.json'
);

export const createDb = async () => {
  access(dbPath)
    .then(() => console.log('database already exists'))
    .catch(() =>
      writeFile(dbPath, '[]').then(() =>
        console.log('a new database has been created')
      )
    );
};
