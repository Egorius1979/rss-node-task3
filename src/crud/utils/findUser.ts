import { validate } from 'uuid';
import { read } from '../db/readWriteDb';
import { IRes } from '../read';

export const findUser = async (userId: string, res: IRes) => {
  if (validate(userId)) {
    const user = await read(userId);

    if (user) {
      return user;
    } else {
      {
        res.writeHead(404);
        res.end('no such record');
      }
    }
  } else {
    res.writeHead(400);
    res.end('not a uuid');
  }
};
