import { IReq, IRes } from './read';
import { contType } from '../index';
import { read, write } from './db/readWriteDb';
import { IUser } from '../crud/utils/user';
import { getUserId } from './utils/userId';
import { setUpdatedUser } from './utils/user';
import { serverError } from '../index';
import { findUser } from './utils/findUser';
import { setError, setResponse } from './utils/response';

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
        const result = await setUpdatedUser(body, user, res);

        if (result) {
          let usersArray: IUser[] = await read('', res);
          usersArray = usersArray.map((user) =>
            user.id === userId ? result : user
          );
          await write(JSON.stringify(usersArray), res);
          res.writeHead(200, contType);
          res.end(setResponse(result));
        } else {
          res.writeHead(400, contType);
          res.end(setError('wrong properties types'));
        }
      } else {
        res.writeHead(404, contType);
        res.end(setError('no changes'));
      }
    });
  } catch {
    res.writeHead(500, contType);
    res.end(setError(serverError));
  }
};

export default updateUser;
