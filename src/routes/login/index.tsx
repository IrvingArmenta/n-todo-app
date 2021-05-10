import style from './style.css';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import Cookies from 'js-cookie';
import Logo from '../../assets/img/todo-app-logo.svg';
import anime from 'animejs';
const USER_COOKIE_NAME = 'TodoApp-User-Cookie';

// components
import Container from '../../components/container';
import Input from '../../components/input';
import Button from '../../components/button';
import Timer from '../../components/timer';
import { createUser, getUser } from '../../api/helpers';
import { db } from '../../api/db';
import { User } from '../../api/models/user';

const Login: FunctionalComponent = () => {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [inputError, setInputError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const userCookie = Cookies.get(USER_COOKIE_NAME);

  const handleSubmit = useCallback(
    async (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault();
      if (
        userName &&
        userName.replace(/\s/g, '').length &&
        !userName.trim().includes(' ')
      ) {
        setInputError('');
        await db.transaction('rw', db.users, async () => {
          const newUser = new User(userName);

          await createUser(db, newUser);
        });
        Cookies.set(USER_COOKIE_NAME, userName);
        anime({
          targets: pageRef.current,
          scale: [1, 0.9],
          complete: () => {
            route('/dashboard');
          }
        });
      } else {
        setInputError('スペースは使えません');
      }
    },
    [userName]
  );

  // オペニング アニメーション
  useEffect(() => {
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
          duration: 900,
          update: (e) => {
            if (Number(e.progress.toFixed(0)) > 10) {
              document.getElementById('preact_root')?.classList.add('border');
            }
          }
        })
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
    } else {
      // user cookieがあれば、このページにredirectします
      route('/dashboard');
    }
  }, [userCookie]);

  if (userCookie) {
    return null;
  }

  return (
    <div className={`${style.loginWrap} app-page centered`} ref={pageRef}>
      <Timer />
      <span className={style.logo} ref={logoRef}>
        <Logo title="Todo App" />
      </span>
      <form className={style.loginForm} onSubmit={handleSubmit} ref={formRef}>
        <Container title="ログイン">
          <Input
            onInput={(v) => setUserName(v.currentTarget.value)}
            value={userName}
            id="nameInput"
            label="ID"
            setsumei="名前を書いてください"
            maxLength={12}
            required={true}
            error={inputError}
          />
        </Container>
        <Button type="submit" variant="primary">
          次へ
        </Button>
      </form>
      <footer className={style.footer} id="introFooter">
        <a
          href="https://github.com/IrvingArmenta"
          target="__blank"
          rel="noopen noreferrer"
        >
          <span>by イルビン</span>
          <i className="icon github" title="IrvingArmenta" role="img" />
        </a>
      </footer>
    </div>
  );
};

export default Login;
