import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import { contType } from '../index';
import { read } from './db/readWriteDb';
import { getUserId } from './utils/userId';

export type IReq = IncomingMessage;
export type IRes = ServerResponse;

export const getUsers = async (req: IReq, res: IRes) => {
  if (req.url === '/api/users') {
    return getAllUsers(req, res);
  }
  return getUser(req, res);
};

async function getAllUsers(req: IReq, res: IRes) {
  try {
    const usersArray = await read('');
    res.writeHead(200, contType);
    res.end(JSON.stringify(usersArray));
  } catch (e) {
    console.error(e);
  }
}

async function getUser(req: IReq, res: IRes) {
  const userId = getUserId(req.url);

  try {
    if (validate(userId)) {
      const user = await read(userId);
      if (user) {
        res.writeHead(200, contType);
        res.end(JSON.stringify(user));
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
}

export default getUsers;
