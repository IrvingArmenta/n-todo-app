import type { TodoItem } from '@api/models/todoItem';
import { clsx, sleep } from '@utils';
import type { FunctionalComponent, h } from 'preact';
import FlipMove from 'react-flip-move';

import { db } from '@api/db';
import { animate, utils } from 'animejs';
import { type Dispatch, type StateUpdater, useCallback } from 'preact/hooks';
import { Transition } from 'react-transition-group';
import { dateFormat } from 'src/dateFormat';
import DeleteIcon from '../../assets/img/delete-icon.svg?react';
import EditIcon from '../../assets/img/edit-icon.svg?react';

// styles
import style from './style.module.css';

const ListOfTodos: FunctionalComponent<{
  listTodos?: TodoItem[];
  activeTodo?: string;
  setActiveTodo: Dispatch<StateUpdater<string>>;
  listOfTodosEditButtonHandler: (selectedTodoItem: TodoItem) => void;
}> = (props) => {
  const {
    listTodos = [],
    activeTodo,
    setActiveTodo,
    listOfTodosEditButtonHandler
  } = props;

  console.log(activeTodo);

  const handleInputCheck = useCallback(
    async (e: h.JSX.TargetedEvent<HTMLInputElement, Event>, todoId: string) => {
      try {
        await db.transaction('rw', db.todoItems, async () => {
          await db.todoItems.update(todoId, { done: e.currentTarget.checked });
        });
      } catch (e) {
        throw new Error('データベースエラー');
      }
    },
    []
  );

  const handleTodoDelete = useCallback(async (todoId: string) => {
    try {
      await db.transaction('rw', db.todoItems, async () => {
        await db.todoItems.delete(todoId);
      });
    } catch (e) {
      throw new Error('データベースエラー');
    }
  }, []);

  if (listTodos.length === 0) {
    return <p>表示するToDoはありません</p>;
  }

  return (
    <FlipMove
      typeName="ul"
      duration={500}
      easing={'cubic-bezier(0.39,0,0.45,1.4)'}
      staggerDurationBy={22}
      staggerDelayBy={10}
      delay={0}
    >
      {listTodos?.map((todo) => {
        return (
          <li className={style.todoItem} key={todo.gid}>
            <label className="pixel-border" htmlFor={`${todo.gid}-checkbox`}>
              <input
                type="checkbox"
                className={style.appCheckbox}
                id={`${todo.gid}-checkbox`}
                checked={todo.done}
                onInput={(e) => handleInputCheck(e, todo.gid || '')}
              />
              <span role="img" />
            </label>
            <section
              className={clsx(
                todo.done && style.done,
                'pixel-border',
                activeTodo === `${todo.gid}-section` && style.isActive
              )}
              id={`${todo.gid}-section`}
              style={{ position: 'relative' }}
            >
              <button
                aria-label={`select ${todo.title} Todo`}
                type="button"
                className={style.setActiveButton}
                onClick={() => {
                  console.log(todo);

                  if (!todo.done) {
                    setActiveTodo(`${todo.gid}-section`);
                  }
                }}
              />
              <header>
                <h3 id="todoTitle">{todo.title}</h3>
                <time dateTime={dateFormat(todo.creationDate).toISOString()}>
                  {dateFormat(todo.creationDate).format('LL LTS')}
                </time>
              </header>
              <div>
                <p>{todo.description || '---'}</p>
              </div>
              <Transition
                timeout={600}
                mountOnEnter={true}
                unmountOnExit={true}
                in={activeTodo === `${todo.gid}-section`}
                onEntering={(node: HTMLElement) => {
                  utils.remove(node);
                  animate(node, {
                    width: [0, '100%'],
                    padding: [0, 8],
                    duration: 600,
                    easing: 'easeInOutExpo'
                  });
                }}
                onExiting={(node: HTMLElement) => {
                  utils.remove(node);
                  animate(node, {
                    width: 0,
                    padding: 0,
                    duration: 600,
                    easing: 'easeInOutExpo'
                  });
                }}
              >
                <span className={style.actions}>
                  <button
                    type="button"
                    onClick={async () => {
                      await sleep(150);
                      if (
                        window.confirm(
                          'ToDoが完全に削除されます、よろしいですか？'
                        )
                      ) {
                        handleTodoDelete(todo.gid || '');
                      }
                    }}
                    className="pixel-border"
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      listOfTodosEditButtonHandler(todo);
                    }}
                    className="pixel-border"
                  >
                    <EditIcon />
                  </button>
                </span>
              </Transition>
            </section>
          </li>
        );
      })}
    </FlipMove>
  );
};

export default ListOfTodos;
