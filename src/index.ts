import 'dotenv/config';
import { createServer } from 'http';
import getUsers from './crud/read';
import addUser from './crud/create';
import updateUser from './crud/update';
import deleteUser from './crud/delete';
import { createDb } from './crud/db/createDb';
import { setError } from './crud/utils/response';
import cluster from 'cluster';
import { cpus } from 'os';

export const contType = { 'Content-Type': 'application/json' };
export const serverError = 'sorry, server error';

export const server = createServer((req, res) => {
  const urlArr = req.url.split('/');
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
    res.writeHead(404, contType);
    res.end(setError('no such endpoint'));
  }
});

const PORT = process.env.PORT || 8090;

if (process.env.NODE_ENV !== 'cluster') {
  createDb();
  server.listen(PORT, () => console.log(`server running on ${PORT}`));
} else if (cluster.isPrimary) {
  createDb();

  cpus().forEach(() => cluster.fork());

  console.log(`Primary ${process.pid} is running`);
  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker ${process.pid} started`);
  server.listen(PORT);
}
