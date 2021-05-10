import AbstractEntity from '../abstractEntity';

export type TodoItemType = {
  todoListId: string;
  title: string;
  description: string;
  dueDate?: Date;
  creationDate: Date;
};

/*
 * The class helps with code completion
 * Defines the interface of objects in the todos items for lists
 */
export class TodoItem extends AbstractEntity {
  constructor(
    public todoListId: string,
    public title: string,
    public description: string,
    public creationDate: Date,
    public dueDate?: Date,
    gid?: string
  ) {
    super(gid);
  }
}
