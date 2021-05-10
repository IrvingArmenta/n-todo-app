import { AppDatabase } from './db';
import { User } from './models/user';

export async function createUser(db: AppDatabase, user: User) {
  return await db.users.put(user);
}

export async function getUser(db: AppDatabase, userId: string) {
  return await db.users.get(userId);
}

export async function loadUserData(db: AppDatabase, user: User) {
  if (user.gid) {
    [user.todoLists] = await Promise.all([
      db.todoLists.where('userId').equals(user.gid).toArray()
    ]);
  } else {
    throw new Error('user id was not defined');
  }
}
