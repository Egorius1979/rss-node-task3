import { createServer } from 'http';
// import 'dotenv/config';
import getUsers from './crud/read';
import addUser from './crud/create';
import updateUser from './crud/update';
import deleteUser from './crud/delete';

export const contType = { 'Content-Type': 'application/json' };
const PORT = process.env.PORT || 8090;

const server = createServer((req, res) => {
  const urlArr = req.url?.split('/');
  const isValidEndpoint = urlArr[1] === 'api' && urlArr[2] === 'users';
  const isPutDelValidEndpoint = isValidEndpoint && urlArr.length === 4;

  if (req.method === 'GET' && isValidEndpoint && urlArr.length <= 4) {
    return getUsers(req, res);
  }
  if (req.method === 'POST' && isValidEndpoint && urlArr.length === 3) {
    return addUser(req, res);
  }
  if (req.method === 'PUT' && isPutDelValidEndpoint) {
    return updateUser(req, res);
  }
  if (req.method === 'DELETE' && isPutDelValidEndpoint) {
    return deleteUser(req, res);
  } else {
    res.writeHead(404);
    res.end('no such endpoint');
  }
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));
