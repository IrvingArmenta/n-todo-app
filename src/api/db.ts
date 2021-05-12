import Dexie from 'dexie';
import { TodoItem } from './models/todoItem';
import { TodoList } from './models/todoList';
import { User } from './models/user';

export class AppDatabase extends Dexie {
  public users!: Dexie.Table<User, string>;
  public todoLists!: Dexie.Table<TodoList, string>;
  public todoItems!: Dexie.Table<TodoItem, string>;

  constructor() {
    super('TodoUsersDatabase');
    // eslint-disable-next-line @typescript-eslint/no-this-alias

    //
    // Define tables and indexes
    //
    this.version(1).stores({
      users: '&gid, name',
      todoLists: '&gid, userId, type, todoList',
      todoItems: '&gid, todolistId, type, todoItem'
    });

    // Let's physically map Contact class to contacts table.
    // This will make it possible to call loadEmailsAndPhones()
    // directly on retrieved database objects.
    this.users.mapToClass(User);
    this.todoLists.mapToClass(TodoList);
    this.todoItems.mapToClass(TodoItem);
  }
}
export const db = new AppDatabase();
