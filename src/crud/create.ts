import { v4 as uuid } from 'uuid';
import { read, write } from './db/readWriteDb';
import { contType } from '../index';
import { IReq, IRes } from './read';

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
}

const addUser = async (req: IReq, res: IRes) => {
  try {
    if (req.url === '/api/users') {
      let body: string = '';

      req.on('data', (chunk) => {
        body += String(chunk);
      });
      req.on('end', async () => {
        const { username, age, hobbies } = JSON.parse(body);

        if (username && age && hobbies) {
          const user: IUser = { id: uuid(), username, age, hobbies };
          const usersArray = await read('');
          await write(JSON.stringify([...usersArray, user]));

          res.writeHead(201, contType);
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(400, contType);
          res.end('required properties are not specified');
        }
      });
    } else {
      res.writeHead(400, contType);
      res.end('Неверный путь');
    }
  } catch (e) {
    console.error(e);
  }
};

export default addUser;
