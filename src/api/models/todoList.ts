import AbstractEntity from '../abstractEntity';
import { TodoItem } from './todoItem';

export type TodoListType = {
  userId: string;
  name: string;
  creationDate: Date;
};

/*
 * Class mapped to the the todolist table in db.ts by the line:
 * db.todolists.mapToClass(TodoList)
 */
export class TodoList extends AbstractEntity {
  todoItems!: TodoItem[];

  constructor(
    public userId: string,
    public name: string,
    public creationDate: Date,
    gid?: string
  ) {
    super(gid);
    // Define navigation properties.
    // Making them non-enumerable will prevent them from being handled by indexedDB
    // when doing put() or add().
    Object.defineProperties(this, {
      todoItems: { value: [], enumerable: false, writable: true }
    });
  }
}
