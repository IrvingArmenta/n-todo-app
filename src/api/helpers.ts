import { AppDatabase } from './db';
import { TodoItem } from './models/todoItem';
import { TodoList } from './models/todoList';
import { User } from './models/user';

export async function createUser(db: AppDatabase, user: User) {
  return await db.users.put(user);
}

export async function createTodoList(db: AppDatabase, todoList: TodoList) {
  return await db.todoLists.put(todoList);
}

export async function createTodoItem(db: AppDatabase, todoItem: TodoItem) {
  return await db.todoItems.put(todoItem);
}

export async function createTodoItemBulk(
  db: AppDatabase,
  todoItems: TodoItem[]
) {
  return await db.todoItems.bulkPut(todoItems);
}
