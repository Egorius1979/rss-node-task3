import { v4 as uuid, validate } from 'uuid';
import { IReq, IRes } from './read';
import { contType } from '../index';
import { read, write } from './db/readWriteDb';
import { IUser } from './create';

export const updateUser = async (req: IReq, res: IRes) => {
  const reqArr = req.url?.split('/').filter((it) => it);
  const userId = reqArr[2];

  try {
    if (
      req.url.includes('/api/users/') &&
      reqArr?.length === 3 &&
      validate(userId)
    ) {
      const user: IUser = await read(userId);

      if (user) {
        let body: string = '';
        req.on('data', (chunk) => {
          body += String(chunk);
        });

        req.on('end', async () => {
          const { username, age, hobbies } = JSON.parse(body);
          const updatedUser = {
            id: user.id,
            username: username || user.username,
            age: age || user.age,
            hobbies: hobbies ? [...user.hobbies, ...hobbies] : user.hobbies,
          };

          let usersArray: IUser[] = await read('');
          usersArray = usersArray.map((user) =>
            user.id === userId ? updatedUser : user
          );
          await write(JSON.stringify(usersArray));
          res.writeHead(200, contType);
          res.end(JSON.stringify(updatedUser));
        });
      } else {
        res.writeHead(404, contType);
        res.end('no such record');
      }
    } else {
      res.writeHead(400, contType);
      res.end('not a uuid');
    }
  } catch (e) {
    console.error(e);
  }
};

export default updateUser;
