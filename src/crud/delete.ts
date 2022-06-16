import { validate } from 'uuid';
import { IReq, IRes } from './read';
import { IUser } from '../crud/utils/user';
import { read, write } from './db/readWriteDb';
import { getUserId } from './utils/userId';

const deleteUser = async (req: IReq, res: IRes) => {
  const userId = getUserId(req.url);

  try {
    if (validate(userId)) {
      let usersArray: IUser[] = await read('');

      if (usersArray.find((user) => user.id === userId)) {
        usersArray = usersArray.filter((user) => user.id !== userId);
        await write(JSON.stringify(usersArray));
        res.writeHead(204);
        res.end();
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

export default deleteUser;
