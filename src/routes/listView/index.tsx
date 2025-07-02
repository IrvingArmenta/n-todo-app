import { db } from '@api/db';
import { TodoItem } from '@api/models/todoItem';
import { AddButton, Button, Input, Modal, Textarea } from '@components';
import { clsx, itsNotEmpty } from '@utils';
import { animate } from 'animejs';
import type { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { getCookie } from 'tiny-cookie';

import style from './style.module.css';

// hooks
import { useLiveQuery } from 'dexie-react-hooks';
import useClickAway from '../../hooks/useClickAway';

import DeleteIcon from '../../assets/img/delete-icon.svg?react';
// components
import { TODO_APP_COOKIE } from '../../globals';
import ListOfTodos from './ListOfTodos';
import ListViewFooter from './ListViewFooter';

type ListViewType = {
  listId: string;
};

const filtersArr = ['hideOnGoing', 'hideDone', 'showAll'] as const;
export type TODOS_FILTERS = {
  type: (typeof filtersArr)[number];
};

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
  const [formMode, setFormMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [currentFilter, setCurrentFilter] = useState<TODOS_FILTERS>(() => ({
    type: 'showAll'
  }));
  const [order, setOrder] = useState(false);

  // Active Edit Ref update
  useEffect(() => {
    const cur = document.getElementById(activeTodo);
    if (cur) {
      activeTodoRef.current = cur;
    }
  }, [activeTodo]);

  //  イントロアニメーション
  useEffect(() => {
    animate(listViewPageRef.current as HTMLElement, {
      opacity: [0, 1],
      translateX: [32, 0],
      duration: 700,
      ease: 'inOutExpo'
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
    const rootQuery = db.todoItems
      .where('todoListId')
      .equals(listId)
      .and((item) => {
        if (currentFilter.type === 'showAll') {
          return true;
        }
        return currentFilter.type === 'hideDone'
          ? item.done === false
          : item.done === true;
      });

    if (order) {
      return rootQuery.sortBy('creationDate');
    }

    return rootQuery.reverse().sortBy('creationDate');
  }, [listId, currentFilter, order, listUpdate.current]);

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

  const listOfTodosEditButtonHandler = (selectedTodoItem: TodoItem) => {
    setToggleModal(true);
    setFormMode('EDIT');
    setEditingTodo(selectedTodoItem.gid || '');
    handleTodoEdit(selectedTodoItem.gid || '', 'POPULATE');
  };

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
        <h4 style={{ color: '#fff' }}>
          {formMode === 'CREATE' ? '作成' : '編集'}
        </h4>
        <Input
          label="タイトル"
          setsumei="todoタイトル"
          id="todoTitle"
          value={todoTitle}
          onInput={(e) => setTodoTitle(e.currentTarget.value)}
          ref={titleInputRef}
          maxLength={20}
          required={true}
        />
        <Textarea
          maxLength={60}
          id="shortDescTextarea"
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
          <ListOfTodos
            listTodos={listTodos}
            activeTodo={activeTodo}
            setActiveTodo={setActiveTodo}
            listOfTodosEditButtonHandler={listOfTodosEditButtonHandler}
          />
        </div>
      </div>
      <ListViewFooter
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        setFormMode={setFormMode}
        setToggleModal={setToggleModal}
        toggleModal={toggleModal}
      />
    </div>
  );
};

export default ListView;
