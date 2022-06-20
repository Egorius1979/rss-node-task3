import { validate } from 'uuid';
import { read } from '../db/readWriteDb';
import { IRes } from '../read';
import { contType } from '../../index';
import { setError } from '../utils/response';
import { serverError } from '../../index';

export const findUser = async (userId: string, res: IRes) => {
  try {
    if (validate(userId)) {
      const user = await read(userId, res);

      if (user) {
        return user;
      } else {
        {
          res.writeHead(404, contType);
          res.end(setError('no such record'));
        }
      }
    } else {
      res.writeHead(400, contType);
      res.end(setError('not a uuid'));
    }
  } catch {
    res.writeHead(500, contType);
    res.end(setError(serverError));
  }
};
