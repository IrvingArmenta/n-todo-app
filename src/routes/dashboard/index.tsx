/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FunctionalComponent, h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../api/db';
import Cookies from 'js-cookie';
import FlipMove from 'react-flip-move';
import anime from 'animejs';
import style from './style.css';

// components
import Container from '../../components/container';
import AddButton from '../../components/addButton';
import Input from '../../components/input';
import Modal from '../../components/modal';
import { route } from 'preact-router';
import { TodoList } from '../../api/models/todoList';
import { createTodoList } from '../../api/helpers';
import DeleteIcon from '../../assets/img/delete-icon.svg';

type DashboardType = {
  userFromUrl?: string;
};

const Dashboard: FunctionalComponent<DashboardType> = () => {
  const userCookie = Cookies.get('TodoApp-User-Cookie');
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
          if (userFromDb && userFromDb.gid) {
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
    anime({
      targets: dbPageRef.current,
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
        onModalOpen={() => listTitleInputRef.current.focus()}
        onModalClose={() => {
          setListTitle('');
          listUpdater.current++;
        }}
        onSubmitButtonClick={() => {
          if (listTitleInputRef.current.checkValidity()) {
            handleCreateList(listTitle);
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
        />
      </Modal>
      <Container className={style.listsContainer} title="私のリスト">
        <button
          className="pixel-border"
          onClick={() => setOrder((prev) => !prev)}
          style={{ marginBottom: 8 }}
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
            <li key={todolist.gid} className="pixel-border">
              <header>
                <button
                  className="pixel-border"
                  onClick={() => handleListDelete(todolist.gid || '')}
                >
                  <DeleteIcon />
                </button>
              </header>
              <section
                tabIndex={0}
                role="button"
                onClick={() => {
                  anime({
                    targets: dbPageRef.current,
                    translateX: -32,
                    easing: 'easeInOutExpo',
                    opacity: 0,
                    duration: 700,
                    complete: () => {
                      route(`/dashboard/${todolist.gid}`);
                    }
                  });
                }}
              >
                <h4>{todolist.name}</h4>
              </section>
            </li>
          ))}
        </FlipMove>
      </Container>
      <AddButton
        onClick={() => {
          setToggleModal((p) => !p);
        }}
        closeMode={toggleModal}
      />
    </div>
  );
};

export default Dashboard;
