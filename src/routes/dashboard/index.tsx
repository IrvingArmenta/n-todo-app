import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  useHistory,
  RouteComponentProps,
  useRouteMatch
} from 'react-router-dom';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../api/db';
import Cookies from 'js-cookie';
import FlipMove from 'react-flip-move';
import anime from 'animejs';
import style from './style.css';

// components
import Container from '../../components/container';
import Button from '../../components/button';
import AddButton from '../../components/addButton';
import Input from '../../components/input';
import TextArea from '../../components/textarea';
import Modal from '../../components/modal';

type DashboardType = {
  userFromUrl?: string;
} & RouteComponentProps;

const Dashboard: FunctionalComponent<DashboardType> = () => {
  const userCookie = Cookies.get('TodoApp-User-Cookie');
  const [toggleModal, setToggle] = useState(false);
  const dbPageRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const { path } = useRouteMatch();

  // form elements state
  const [shortDesc, setShorDesc] = useState('');
  const [listTitle, setListTitle] = useState('');
  const listTitleInputRef = useRef<HTMLInputElement>(null);

  const userFromDb = useLiveQuery(
    () =>
      db.users
        .where('name')
        .equals(userCookie || '')
        .first(),
    [userCookie]
  );

  const usersTodoLists = useLiveQuery(
    () =>
      db.todoLists
        .where('userId')
        .equals(userFromDb?.gid || '')
        .toArray(),
    [userFromDb]
  );

  // const handleCreateList = useCallback(() => {}, []);

  // アニメーション
  useEffect(() => {
    anime({
      targets: dbPageRef.current,
      keyframes: [{ opacity: [0, 1], easing: 'easeInOutQuad' }, { scale: 1 }]
    });
  }, []);

  useEffect(() => {
    document.getElementById('preact_root')?.classList.add('border');
    if (!userCookie) {
      history.push('/');
    }
  }, [history, userCookie]);

  return (
    <div
      className={`${style.dashboard} app-page centered`}
      id="dashboardPage"
      ref={dbPageRef}
    >
      <h1>
        ようこそ、<span>{userFromDb?.name}</span>
      </h1>

      <AddButton
        onClick={() => {
          setToggle((p) => !p);
        }}
        closeMode={toggleModal}
      />
      <Modal
        open={toggleModal}
        onModalOpen={() => listTitleInputRef.current.focus()}
      >
        <Input
          label="リストタイトル"
          setsumei="リストの名前"
          value={listTitle}
          onInput={(e) => setListTitle(e.currentTarget.value)}
          ref={listTitleInputRef}
          maxLength={16}
          required={true}
        />
        <TextArea
          maxLength={40}
          label="概要"
          value={shortDesc}
          onInput={(e) => setShorDesc(e.currentTarget.value)}
        />
      </Modal>
      <Container className={style.listsContainer} title="私のリスト">
        {usersTodoLists && usersTodoLists.length !== 0 && (
          <FlipMove className={style.listsWrapper} typeName="ul">
            {usersTodoLists.map((todolist) => (
              <li key={todolist.gid}>
                <Button
                  onClick={() => {
                    anime({
                      targets: dbPageRef.current,
                      translateX: -32,
                      easing: 'easeInOutExpo',
                      opacity: 0,
                      complete: () => {
                        history.push({
                          pathname: `${path}/${todolist.gid}`
                        });
                      }
                    });
                  }}
                >
                  <h4>{todolist.name}</h4>
                  {todolist.description && <p>{todolist.description}</p>}
                </Button>
              </li>
            ))}
          </FlipMove>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
