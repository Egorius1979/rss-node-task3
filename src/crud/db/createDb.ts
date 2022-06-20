import { writeFile } from 'fs/promises';
import { join } from 'path';
// import { access } from 'fs/promises';

export const dbPath = join(
  process.cwd(),
  process.env.NODE_ENV !== 'production' ? './src/crud/db' : './dist/crud/db',
  'users.json'
);

export const createDb = async () => {
  await writeFile(dbPath, '[]');
  // access(dbPath)
  //   .then(() => console.log('database already exists'))
  //   .catch(() =>
  //     writeFile(dbPath, '[]').then(() =>
  //       console.log('a new database has been created')
  //     )
  //   );
};
