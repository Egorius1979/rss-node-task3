import { validate } from 'uuid';
import { IReq, IRes } from './read';
import { contType } from '../index';
import { read, write } from './db/readWriteDb';
import { IUser } from '../crud/utils/user';
import { getUserId } from './utils/userId';
import { setUpdatedUser } from './utils/user';

export const updateUser = async (req: IReq, res: IRes) => {
  const userId = getUserId(req.url);

  try {
    if (validate(userId)) {
      let usersArray: IUser[] = await read('');
      const user = usersArray.find((user) => user.id === userId);

      if (user) {
        let body: string = '';
        req.on('data', (chunk) => {
          body += String(chunk);
        });
        req.on('end', async () => {
          if (body) {
            const result = await setUpdatedUser(body, user);

            if (result) {
              usersArray = usersArray.map((user) =>
                user.id === userId ? result : user
              );
              await write(JSON.stringify(usersArray));
              res.writeHead(200, contType);
              res.end(JSON.stringify(result));
            } else {
              res.writeHead(400);
              res.end('wrong properties types');
            }
          } else {
            res.writeHead(404);
            res.end('no changes');
          }
        });
      } else {
        res.writeHead(404);
        res.end('no such record');
      }
    } else {
      res.writeHead(400);
      res.end('not a uuid');
    }
  } catch (e) {
    console.error(e);
  }
};

export default updateUser;
