import AbstractEntity from '../abstractEntity';
import { TodoList } from './todoList';

/*
 * Class mapped to the the contacts table in db.ts by the line:
 * db.contacts.mapToClass(Contact)
 */
export class User extends AbstractEntity {
  todoLists!: TodoList[];

  constructor(public name: string, gid?: string) {
    super(gid);
    // Define navigation properties.
    // Making them non-enumerable will prevent them from being handled by indexedDB
    // when doing put() or add().
    Object.defineProperties(this, {
      todoLists: { value: [], enumerable: false, writable: true }
    });
  }
}
