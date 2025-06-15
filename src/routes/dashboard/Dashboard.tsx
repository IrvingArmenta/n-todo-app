import { animate } from 'animejs';
import { useLiveQuery } from 'dexie-react-hooks';
import type { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import FlipMove from 'react-flip-move';
import { getCookie } from 'tiny-cookie';
import { db } from '../../api/db';
import { createTodoList } from '../../api/helpers';
import { TodoList } from '../../api/models/todoList';
import DeleteIcon from '../../assets/img/delete-icon.svg?react';
import AddButton from '../../components/addButton';
import Button from '../../components/button';

// components
import Container from '../../components/container';
import Input from '../../components/input';
import Modal from '../../components/modal';
import { TODO_APP_COOKIE } from '../../globals';
import { itsNotEmpty, sleep } from '../../utils';

import style from './style.module.css';

type DashboardType = {
  userFromUrl?: string;
};

const Dashboard: FunctionalComponent<DashboardType> = () => {
  const userCookie = getCookie(TODO_APP_COOKIE);
  const [toggleModal, setToggleModal] = useState(false);
  const dbPageRef = useRef<HTMLDivElement>(null);
  const listUpdater = useRef(0);

  // form elements state
  const [listTitle, setListTitle] = useState('');
  const [order, setOrder] = useState(false);
  const listTitleInputRef = useRef<HTMLInputElement>(null);

  const userFromDb = useLiveQuery(
    () =>
      db.users
        .where('name')
        .equals(userCookie || '')
        .first(),
    [userCookie]
  );

  const usersTodoLists = useLiveQuery(() => {
    if (order) {
      return db.todoLists
        .where('userId')
        .equals(userFromDb?.gid || '')
        .sortBy('creationDate');
    }
    return db.todoLists
      .where('userId')
      .equals(userFromDb?.gid || '')
      .reverse()
      .sortBy('creationDate');
  }, [userFromDb, listUpdater.current, order]);

  const handleCreateList = useCallback(
    async (newListName: string, newListDescription?: string) => {
      try {
        await db.transaction('rw', db.todoLists, async () => {
          if (userFromDb?.gid) {
            const newList = new TodoList(
              userFromDb.gid,
              newListName,
              new Date(),
              newListDescription
            );

            await createTodoList(db, newList);
          } else {
            throw new Error('user id not found');
          }
        });
        setToggleModal(false);
      } catch (e) {
        throw new Error('データベースエラー');
      }
    },
    [userFromDb]
  );

  const handleListDelete = useCallback(async (listId: string) => {
    if (window.confirm('リストは完全に削除されます、よろしいですか？')) {
      try {
        await db.transaction('rw', db.todoLists, async () => {
          await db.todoLists.delete(listId);
        });
        setToggleModal(false);
      } catch (e) {
        throw new Error('データベースエラー');
      }
    }
  }, []);

  // アニメーション
  useEffect(() => {
    animate('#dashboardPage', {
      keyframes: [{ opacity: [0, 1], easing: 'easeInOutQuad' }, { scale: 1 }]
    });
  }, []);

  return (
    <div
      className={`${style.dashboard} app-page centered`}
      id="dashboardPage"
      ref={dbPageRef}
    >
      <h1>
        ようこそ、<span>{userFromDb?.name}</span>
      </h1>
      <Modal
        open={toggleModal}
        modalHeight={240}
        onModalOpen={() => listTitleInputRef.current?.focus()}
        onModalClose={() => {
          setListTitle('');
          listUpdater.current++;
        }}
        onSubmitButtonClick={() => {
          if (itsNotEmpty(listTitle)) {
            if (listTitleInputRef.current?.checkValidity()) {
              handleCreateList(listTitle);
            }
          } else {
            setListTitle('');
          }
        }}
        onCancelButtonClick={() => {
          setToggleModal(false);
        }}
      >
        <Input
          label="リストタイトル"
          setsumei="リストの名前"
          value={listTitle}
          onInput={(e) => setListTitle(e.currentTarget.value)}
          ref={listTitleInputRef}
          maxLength={24}
          required={true}
          id="listTitleInput"
        />
      </Modal>
      <Container className={style.listsContainer} title="私のリスト">
        <button
          className="pixel-border"
          onClick={() => setOrder((prev) => !prev)}
          type="button"
          style={{ marginBottom: 16 }}
        >
          {`日付 ${order ? '▲' : '▼'}`}
        </button>
        <FlipMove
          className={style.listsWrapper}
          typeName="ul"
          duration={500}
          easing={'cubic-bezier(0.39,0,0.45,1.4)'}
          staggerDurationBy={22}
          staggerDelayBy={10}
          delay={0}
        >
          {usersTodoLists?.map((todolist) => (
            <li key={todolist.gid}>
              <Button
                onClick={() => {
                  animate('#dashboardPage', {
                    translateX: -32,
                    ease: 'inOutExpo',
                    opacity: 0,
                    duration: 700,
                    onComplete: () => {
                      route(`/dashboard/${todolist.gid}`);
                    }
                  });
                }}
              >
                {todolist.name}
              </Button>
              <span>
                <Button
                  variant="primary"
                  onClick={async () => {
                    await sleep(150);
                    handleListDelete(todolist.gid || '');
                  }}
                >
                  <DeleteIcon />
                </Button>
              </span>
            </li>
          ))}
        </FlipMove>
      </Container>
      <AddButton
        style={{ '--button-size': '90px' }}
        onClick={() => {
          setToggleModal((p) => !p);
        }}
        closeMode={toggleModal}
      />
    </div>
  );
};

export default Dashboard;
