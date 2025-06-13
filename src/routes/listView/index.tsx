import { animate, utils } from 'animejs';
import dayjs from 'dayjs';
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import FlipMove from 'react-flip-move';
import { Transition } from 'react-transition-group';
import { getCookie } from 'tiny-cookie';
import { db } from '../../api/db';
import clsx, { itsNotEmpty, sleep } from '../../utils';
import style from './style.module.css';

// hooks
import { useLiveQuery } from 'dexie-react-hooks';
import useClickAway from '../../hooks/useClickAway';

import { TodoItem } from '../../api/models/todoItem';
import DeleteIcon from '../../assets/img/delete-icon.svg?react';
import EditIcon from '../../assets/img/edit-icon.svg?react';
import AddButton from '../../components/addButton';
import Button from '../../components/button';
// components
import Input from '../../components/input';
import Modal from '../../components/modal';
import TextArea from '../../components/textarea';
import { TODO_APP_COOKIE } from '../../globals';

type ListViewType = {
  listId: string;
};

const filtersArr = ['hideOnGoing', 'hideDone', 'showAll'] as (
  | 'hideOnGoing'
  | 'hideDone'
  | 'showAll'
)[];

const ListView: FunctionalComponent<ListViewType> = (props) => {
  const { listId } = props;
  const userCookie = getCookie(TODO_APP_COOKIE);
  const listViewPageRef = useRef<HTMLDivElement>(null);
  const [toggleModal, setToggleModal] = useState(false);
  const listUpdate = useRef<number>(0);
  const [activeTodo, setActiveTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState('');
  const activeTodoRef = useRef<HTMLElement | null>(null);

  // フォームデータ
  const [todoTitle, setTodoTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [formMode, setForMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [filters, setFilters] = useState<{
    type: 'hideOnGoing' | 'hideDone' | 'showAll';
  }>(() => ({ type: 'showAll' }));
  const [order, setOrder] = useState(false);

  // Active Edit Ref update
  useEffect(() => {
    const cur = document.getElementById(activeTodo);
    if (cur) {
      activeTodoRef.current = cur;
    }
  }, [activeTodo]);

  // オエニングアニメーション
  useEffect(() => {
    animate(listViewPageRef.current as HTMLElement, {
      opacity: [0, 1],
      translateX: [32, 0],
      duration: 700,
      easing: 'easeInOutExpo'
    });
  }, []);

  // cookie チェック
  useEffect(() => {
    if (!userCookie) {
      route('/');
    }
  }, [userCookie]);

  useClickAway(activeTodoRef, () => {
    setActiveTodo('');
  });

  // indexedDB dexie fetch
  const listInfo = useLiveQuery(
    () => db.todoLists.where('gid').equals(listId).first(),
    [listId]
  );

  // indexedDB dexie fetch
  const listTodos = useLiveQuery(async () => {
    if (order) {
      return await db.todoItems
        .where('todoListId')
        .equals(listId)
        .and((item) => {
          if (filters.type === 'showAll') {
            return true;
          }
          return filters.type === 'hideDone'
            ? item.done === false
            : item.done === true;
        })
        .sortBy('creationDate');
    }
    return await db.todoItems
      .where('todoListId')
      .equals(listId)
      .and((item) => {
        if (filters.type === 'showAll') {
          return true;
        }
        return filters.type === 'hideDone'
          ? item.done === false
          : item.done === true;
      })
      .reverse()
      .sortBy('creationDate');
  }, [listId, filters, order, listUpdate.current]);

  const handleCreateTodo = useCallback(
    async (todoTitle: string, todoDescription?: string) => {
      try {
        await db.transaction('rw', db.todoItems, async () => {
          const newTodo = new TodoItem(
            listId,
            todoTitle,
            new Date(),
            false,
            todoDescription
          );

          await db.todoItems.put(newTodo);
        });
        setToggleModal(false);
      } catch (e) {
        throw new Error('データベースエラー');
      }
    },
    [listId]
  );

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

  const handleTodoEdit = useCallback(
    async (
      todoId: string,
      step: 'POPULATE' | 'SUBMIT',
      newTodoTitle?: string,
      newTodoDesc?: string
    ) => {
      try {
        if (step === 'POPULATE') {
          await db.transaction('rw', db.todoItems, async () => {
            const editing = await db.todoItems.get(todoId);
            if (editing) {
              setTodoTitle(editing.title);
              setShortDesc(editing.description || '');
            }
            return;
          });
        }

        if (step === 'SUBMIT') {
          await db.transaction('rw', db.todoItems, async () => {
            await db.todoItems.update(todoId, {
              title: newTodoTitle,
              description: newTodoDesc
            });
            setToggleModal(false);
            listUpdate.current++;
            return;
          });
        }
      } catch (e) {
        throw new Error('データベースエラー');
      }
    },
    []
  );

  const handleListDelete = useCallback(async (listId: string) => {
    try {
      await db.transaction('rw', db.todoItems, db.todoLists, async () => {
        const listItems = await db.todoItems
          .where('todoListId')
          .equals(listId)
          .toArray();

        for (const item of listItems) {
          if (item.gid) {
            await db.todoItems.delete(item.gid);
          }
        }
      });
    } catch (e) {
      throw new Error('データベースエラー');
    }
  }, []);

  // cookie チェック
  if (!userCookie) {
    return null;
  }

  return (
    <div
      id="appPage"
      className={`${style.listViewWrapper} app-page`}
      ref={listViewPageRef}
    >
      <Modal
        open={toggleModal}
        onModalOpen={() => {
          if (titleInputRef.current) {
            titleInputRef.current.focus();
          }
        }}
        onModalClose={() => {
          setEditingTodo('');
          setShortDesc('');
          setTodoTitle('');
          if (formMode === 'CREATE') {
            listUpdate.current++;
          }
        }}
        onSubmitButtonClick={() => {
          if (itsNotEmpty(todoTitle)) {
            if (titleInputRef.current?.checkValidity()) {
              if (formMode === 'CREATE') {
                handleCreateTodo(todoTitle, shortDesc);
              }
              if (formMode === 'EDIT') {
                handleTodoEdit(editingTodo, 'SUBMIT', todoTitle, shortDesc);
              }
            }
          } else if (formMode === 'CREATE') {
            setTodoTitle('');
          }
        }}
        onCancelButtonClick={() => setToggleModal(false)}
      >
        <span style={{ color: '#fff' }}>
          {formMode === 'CREATE' ? '作成' : '編集'}
        </span>
        <Input
          label="タイトル"
          setsumei="todoタイトル"
          value={todoTitle}
          onInput={(e) => setTodoTitle(e.currentTarget.value)}
          ref={titleInputRef}
          maxLength={20}
          required={true}
        />
        <TextArea
          maxLength={60}
          label="概要"
          value={shortDesc}
          onInput={(e) => setShortDesc(e.currentTarget.value)}
        />
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 24
        }}
      >
        <Button
          style={{
            width: 90,
            minHeight: 40
          }}
          onClick={() => {
            animate(listViewPageRef.current as HTMLElement, {
              opacity: 0,
              translateX: 32,
              duration: 700,
              ease: 'inOutExpo',
              onComplete: () => {
                route('/dashboard');
              }
            });
          }}
        >
          ← 戻る
        </Button>
        <Button
          style={{
            minHeight: 40,
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => {
            if (
              window?.confirm(
                'リスト内のすべてのアイテムが削除されます、よろしいですか？'
              )
            )
              handleListDelete(listId);
          }}
        >
          リスト削除
          <DeleteIcon width={20} style={{ marginLeft: 8 }} />
        </Button>
      </div>
      <header>
        <h1 style={{ '--arrowTop': -3 }} className="iconArrow">
          {listInfo?.name}
        </h1>
        <button
          className="pixel-border"
          onClick={() => setOrder((prev) => !prev)}
          type="button"
        >
          {`日付 ${order ? '▲' : '▼'}`}
        </button>
      </header>
      <div className={`${style.containerWrap} pixel-border`}>
        <div
          className={style.customContainer}
          style={{ '--checkColor': 'red' }}
        >
          {listTodos?.length === 0 && '表示するToDoはありません'}
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
                  <label
                    className="pixel-border"
                    htmlFor={`${todo.gid}-checkbox`}
                  >
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
                        if (!todo.done) {
                          setActiveTodo(`${todo.gid}-section`);
                        }
                      }}
                    />
                    <header>
                      <h3 id="todoTitle">{todo.title}</h3>
                      <time dateTime={dayjs(todo.creationDate).toString()}>
                        {dayjs(todo.creationDate).locale('ja').format('LL LTS')}
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
                            setToggleModal(true);
                            setForMode('EDIT');
                            setEditingTodo(todo.gid || '');
                            handleTodoEdit(todo.gid || '', 'POPULATE');
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
        </div>
      </div>
      <footer
        style={{
          justifyContent: 'space-between ',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className={style.filtersWrap}>
          <h4>フィルター</h4>
          <span>
            {filtersArr.map((type) => {
              return (
                <button
                  key={type}
                  type="button"
                  className={`${
                    type === filters.type ? style.active : ''
                  } pixel-border`}
                  onClick={() => setFilters({ type })}
                >
                  {type === 'hideOnGoing' && '完了'}
                  {type === 'hideDone' && 'まだ'}
                  {type === 'showAll' && '全部'}
                </button>
              );
            })}
          </span>
        </div>
        <AddButton
          onClick={() => {
            setForMode('CREATE');
            setToggleModal((v) => !v);
          }}
          closeMode={toggleModal}
        />
      </footer>
    </div>
  );
};

export default ListView;
