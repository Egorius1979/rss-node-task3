// import { validate } from 'uuid';
import { IReq, IRes } from './read';
import { contType } from '../index';
import { read, write } from './db/readWriteDb';
import { IUser } from '../crud/utils/user';
import { getUserId } from './utils/userId';
import { setUpdatedUser } from './utils/user';
import { serverError } from '../index';
import { findUser } from './utils/findUser';

export const updateUser = async (req: IReq, res: IRes) => {
  const userId = getUserId(req.url);
  const user: IUser = await findUser(userId, res);
  if (!user) return;

  try {
    let body: string = '';
    req.on('data', (chunk) => {
      body += String(chunk);
    });
    req.on('end', async () => {
      if (body) {
        const result = await setUpdatedUser(body, user);

        if (result) {
          let usersArray: IUser[] = await read('');
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
  } catch {
    res.writeHead(500);
    res.end(serverError);
  }
};

export default updateUser;
