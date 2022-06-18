import { read, write } from './db/readWriteDb';
import { contType } from '../index';
import { IReq, IRes } from './read';
import { createUser } from './utils/user';
import { serverError } from '../index';
import { setError, setResponse } from './utils/response';

const addUser = async (req: IReq, res: IRes) => {
  try {
    let body: string = '';

    req.on('data', (chunk) => {
      body += String(chunk);
    });
    req.on('end', async () => {
      const result = await createUser(body, res);
      if (!result) return;

      if (typeof result !== 'string') {
        const usersArray = await read('', res);
        await write(JSON.stringify([...usersArray, result]), res);
        res.writeHead(201, contType);
        res.end(setResponse(result));
      } else {
        res.writeHead(400, contType);
        res.end(setError(result));
      }
    });
  } catch {
    res.writeHead(500, contType);
    res.end(setError(serverError));
  }
};

export default addUser;
