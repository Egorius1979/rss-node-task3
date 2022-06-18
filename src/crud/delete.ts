import { IReq, IRes } from './read';
import { IUser } from '../crud/utils/user';
import { read, write } from './db/readWriteDb';
import { getUserId } from './utils/userId';
import { serverError } from '../index';
import { findUser } from './utils/findUser';
import { setError } from './utils/response';
import { contType } from '../index';

const deleteUser = async (req: IReq, res: IRes) => {
  try {
    const userId = getUserId(req.url);
    const user: IUser = await findUser(userId, res);
    if (!user) return;

    let usersArray: IUser[] = await read('', res);
    usersArray = usersArray.filter((user) => user.id !== userId);
    await write(JSON.stringify(usersArray), res);
    res.writeHead(204);
    res.end();
  } catch {
    res.writeHead(500, contType);
    res.end(setError(serverError));
  }
};

export default deleteUser;
