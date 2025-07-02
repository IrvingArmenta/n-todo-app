import { db } from '@api/db';
import { createTodoItemBulk, createTodoList, createUser } from '@api/helpers';
import { TodoItem } from '@api/models/todoItem';
import { TodoList } from '@api/models/todoList';
import { User } from '@api/models/user';
import dayjs from 'dayjs';

export async function setInitialDBdata(userName: string) {
  await db.transaction('rw', db.users, db.todoLists, db.todoItems, async () => {
    const userExists = await db.users.where('name').equals(userName).first();

    if (userExists) {
      return;
    }

    const newUser = new User(userName);

    const newUserID = await createUser(db, newUser);

    const sampleList = new TodoList(
      newUserID,
      '私のサンプルリスト',
      new Date()
    );

    const sampleListId = await createTodoList(db, sampleList);

    const sampleTodoItems = [
      new TodoItem(
        sampleListId,
        'ランチ',
        dayjs().add(2, 'hour').toDate(),
        false,
        '原宿で友達とランチする'
      ),
      new TodoItem(
        sampleListId,
        '目黒ディナー',
        new Date(),
        false,
        '彼女とデート！'
      ),
      new TodoItem(
        sampleListId,
        '英語のテスト',
        new Date(),
        true,
        '英語のテストの時間！'
      )
    ];

    await createTodoItemBulk(db, sampleTodoItems);
  });
}
