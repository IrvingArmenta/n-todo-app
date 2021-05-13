import AbstractEntity from '../abstractEntity';

export type TodoItemType = {
  todoListId: string;
  title: string;
  description?: string;
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
    public creationDate: Date,
    public done?: boolean,
    public description?: string,
    gid?: string
  ) {
    super(gid);
  }
}
