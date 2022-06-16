import { IncomingMessage, ServerResponse } from 'http';
import { contType } from '../index';
import { read } from './db/readWriteDb';
import { getUserId } from './utils/userId';
import { serverError } from '../index';
import { findUser } from './utils/findUser';

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
  const user = await findUser(userId, res);

  try {
    res.writeHead(200, contType);
    res.end(JSON.stringify(user));
  } catch {
    res.writeHead(500);
    res.end(serverError);
  }
}

export default getUsers;
