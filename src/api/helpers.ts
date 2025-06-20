import type { AppDatabase } from './db';
import type { TodoItem } from './models/todoItem';
import type { TodoList } from './models/todoList';
import type { User } from './models/user';

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
