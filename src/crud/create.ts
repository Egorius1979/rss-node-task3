import { read, write } from './db/readWriteDb';
import { contType } from '../index';
import { IReq, IRes } from './read';
import { createUser } from './utils/user';
import { serverError } from '../index';

const addUser = async (req: IReq, res: IRes) => {
  try {
    let body: string = '';

    req.on('data', (chunk) => {
      body += String(chunk);
    });
    req.on('end', async () => {
      const result = await createUser(body);

      if (typeof result !== 'string') {
        const usersArray = await read('');
        await write(JSON.stringify([...usersArray, result]));
        res.writeHead(201, contType);
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(400);
        res.end(result);
      }
    });
  } catch {
    res.writeHead(500);
    res.end(serverError);
  }
};

export default addUser;
