import { createServer } from 'http';
// import 'dotenv/config';
import getUsers from './crud/read';
import addUser from './crud/create';

export const contType = { 'Content-Type': 'application/json' };
const PORT = process.env.PORT || 8090;

const server = createServer((req, res) => {
  if (req.method === 'GET') {
    getUsers(req, res);
  } else if (req.method === 'POST') {
    addUser(req, res);
  }
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));
