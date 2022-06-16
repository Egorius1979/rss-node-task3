import { arrayBuffer } from 'stream/consumers';
import { v4 as uuid } from 'uuid';

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
}

export async function createUser(body: string) {
  const { username, age, hobbies } = JSON.parse(body);

  if (username && age && hobbies) {
    if (
      typeof username === 'string' &&
      typeof age === 'number' &&
      Array.isArray(hobbies) &&
      hobbies.every((it) => typeof it === 'string')
    ) {
      const user: IUser = { id: uuid(), username, age, hobbies };
      return user;
    }
    return 'wrong properties types';
  }
  return 'required properties are not specified';
}

export async function setUpdatedUser(body: string, user: IUser) {
  const fromBody: IUser = JSON.parse(body);

  if (fromBody.username && typeof fromBody.username !== 'string') return;
  if (fromBody.age && typeof fromBody.age !== 'number') return;
  if (fromBody.hobbies && !Array.isArray(fromBody.hobbies)) return;
  if (
    fromBody.hobbies &&
    !fromBody.hobbies.every((it) => typeof it === 'string')
  )
    return;

  const updatedUser = {
    id: user.id,
    username: fromBody.username || user.username,
    age: fromBody.age || user.age,
    hobbies: fromBody.hobbies?.length
      ? [...user.hobbies, ...fromBody.hobbies].filter(
          (hobbie, idx, arr) => idx === arr.indexOf(hobbie)
        )
      : user.hobbies,
  };
  return updatedUser;
}
