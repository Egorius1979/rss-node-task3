import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import { contType } from '../index';
import { read, write } from './db/readWriteDb';

const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/api/users') {
    const usersArray = await read('');
    res.writeHead(200, contType);
    res.end(JSON.stringify(usersArray));
  } else {
    const reqArr = req.url?.split('/').filter((it) => it);

    if (
      req.url.includes('/api/users/') &&
      reqArr?.length === 3 &&
      validate(reqArr[2])
    ) {
      const user = await read(reqArr[2]);
      // !Number.isNaN(+reqArr[2])) {
      res.writeHead(200, contType);
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, contType);
      res.end('Her');
    }
  }
};

export default getUsers;
