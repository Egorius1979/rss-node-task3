import { IReq, IRes } from './read';
import { IUser } from '../crud/utils/user';
import { read, write } from './db/readWriteDb';
import { getUserId } from './utils/userId';
import { serverError } from '../index';
import { findUser } from './utils/findUser';

const deleteUser = async (req: IReq, res: IRes) => {
  const userId = getUserId(req.url);
  const user: IUser = await findUser(userId, res);
  if (!user) return;

  try {
    let usersArray: IUser[] = await read('');
    usersArray = usersArray.filter((user) => user.id !== userId);
    await write(JSON.stringify(usersArray));
    res.writeHead(204);
    res.end();
  } catch {
    res.writeHead(500);
    res.end(serverError);
  }
};

export default deleteUser;
