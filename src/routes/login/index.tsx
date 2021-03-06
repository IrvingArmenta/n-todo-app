import style from './style.css';
import { FunctionalComponent, h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import Cookies from 'js-cookie';
import Logo from '../../assets/img/todo-app-logo.svg';
import anime from 'animejs';
export const USER_COOKIE_NAME = 'TodoApp-User-Cookie';

// components
import Container from '../../components/container';
import Input from '../../components/input';
import Button from '../../components/button';
import Timer from '../../components/timer';
import {
  createTodoItemBulk,
  createTodoList,
  createUser
} from '../../api/helpers';
import { db } from '../../api/db';
import { User } from '../../api/models/user';
import { TodoList } from '../../api/models/todoList';
import { TodoItem } from '../../api/models/todoItem';
import dayjs from 'dayjs';
import { route } from 'preact-router';

const Login: FunctionalComponent<{ path: string }> = (props) => {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [inputError, setInputError] = useState('');
  const { path } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const userCookie = Cookies.get('TodoApp-User-Cookie');

  const handleSubmit = useCallback(
    async (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault();
      if (
        userName &&
        userName.replace(/\s/g, '').length &&
        !userName.trim().includes(' ')
      ) {
        setInputError('');
        const userN = userName.trim();
        try {
          await db.transaction(
            'rw',
            db.users,
            db.todoLists,
            db.todoItems,
            async () => {
              const userExists = await db.users
                .where('name')
                .equals(userN)
                .first();

              if (!userExists) {
                const newUser = new User(userN);

                const newUserID = await createUser(db, newUser);

                const sampleList = new TodoList(
                  newUserID,
                  '???????????????????????????',
                  new Date()
                );

                const sampleListId = await createTodoList(db, sampleList);

                const sampleTodoItems = [
                  new TodoItem(
                    sampleListId,
                    '?????????',
                    dayjs().add(2, 'hour').toDate(),
                    false,
                    '?????????????????????????????????'
                  ),
                  new TodoItem(
                    sampleListId,
                    '??????????????????',
                    new Date(),
                    false,
                    '?????????????????????'
                  ),
                  new TodoItem(
                    sampleListId,
                    '??????????????????',
                    new Date(),
                    true,
                    '??????????????????????????????'
                  )
                ];

                await createTodoItemBulk(db, sampleTodoItems);
              }
            }
          );
          Cookies.set('TodoApp-User-Cookie', userName, { expires: 7 });
          const tl = anime.timeline({
            duration: 1000,
            targets: pageRef.current
          });

          tl.add({
            scale: 0.92
          })
            .add(
              {
                borderWidth: 0,
                easing: 'easeInOutExpo'
              },
              '-=1000'
            )
            .add(
              {
                opacity: 0,
                easing: 'easeInOutExpo',
                complete: () => {
                  route('/dashboard');
                }
              },
              '-=700'
            );
        } catch (e) {
          setInputError(
            'DB ???????????????????????????????????????????????????????????????????????????'
          );
        }
      } else {
        setInputError('??????????????????????????????');
      }
    },
    [userName]
  );

  // ??????????????? ?????????????????????
  useEffect(() => {
    document.getElementById('preact_root')?.removeAttribute('style');
    if (!userCookie) {
      const tl = anime.timeline({ duration: 500 });

      tl.add({
        targets: logoRef.current,
        opacity: [0, 1],
        translateY: [32, 0],
        delay: 500
      })
        .add({
          targets: formRef.current,
          height: [0, anime.get(formRef.current, 'height')],
          opacity: [0, 1],
          duration: 900
        })
        .add(
          {
            targets: pageRef.current,
            borderWidth: 16,
            easing: 'easeInOutExpo'
          },
          '-=600'
        )
        .add(
          {
            targets: [
              document.getElementById('appTimerId'),
              document.getElementById('introFooter')
            ],
            opacity: [0, 1],
            easing: 'easeInOutQuad'
          },
          '-=500'
        );
    }
    if (userCookie) {
      route('/dashboard');
    }
  }, [path, userCookie]);

  if (userCookie) {
    return null;
  }

  return (
    <div
      className={`${style.loginWrap} app-page centered`}
      ref={pageRef}
      id="loginPage"
    >
      <Timer fixed={true} className={style.appTimer} />
      <span className={style.logo} ref={logoRef}>
        <Logo title="Todo App" />
      </span>
      <form className={style.loginForm} onSubmit={handleSubmit} ref={formRef}>
        <Container title="????????????">
          <Input
            onInput={(v) => setUserName(v.currentTarget.value)}
            value={userName}
            id="nameInput"
            label="ID"
            setsumei="??????????????????????????????"
            maxLength={12}
            required={true}
            error={inputError}
          />
        </Container>
        <Button type="submit" variant="primary">
          ??????
        </Button>
      </form>
      <footer className={style.footer} id="introFooter">
        <a
          href="https://github.com/IrvingArmenta"
          target="__blank"
          rel="noopen noreferrer"
        >
          <span>by ????????????</span>
          <i className="icon github" title="IrvingArmenta" role="img" />
        </a>
      </footer>
    </div>
  );
};

export default Login;
