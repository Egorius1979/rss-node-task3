import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuid } from 'uuid';
import { read, write } from './db/readWriteDb';
import { contType } from '../index';

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
}

const addUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.url === '/api/users') {
      let body: string = '';
      req.on('data', (chunk) => {
        body += String(chunk);
      });

      req.on('end', async () => {
        const { username, age, hobbies } = JSON.parse(body);
        if (username && age) {
          const user: IUser = { id: uuid(), username, age, hobbies };
          const usersArray = await read('');
          await write(JSON.stringify([...usersArray, user]));
          res.writeHead(201, contType);
          res.end(JSON.stringify([...usersArray, user]));
        } else {
          res.writeHead(400, contType);
          res.end({ error: 'required properties are not specified' });
        }
      });
      req.on('error', () => {
        console.log('psdgdsgf');
      });
    } else {
      res.writeHead(400, contType);
      res.end({ error: 'Неверный путь' });
    }
  } catch (e) {
    console.error(e);
  }
};

export default addUser;
