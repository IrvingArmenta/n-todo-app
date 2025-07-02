import { clsx } from '@utils';
import { type Scope, createScope, createTimeline } from 'animejs';
import type { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import type { TargetedEvent } from 'preact/compat';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { getCookie, setCookie } from 'tiny-cookie';
import Logo from '../../assets/img/todo-app-logo.svg?react';
import style from './style.module.css';

// components
import { Button, Container, Input, Timer } from '@components';

import { APP_ROOT, TODO_APP_COOKIE } from '@globals';
import { setInitialDBdata } from './login-utils';

const Login: FunctionalComponent = () => {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [inputError, setInputError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const userCookie = getCookie(TODO_APP_COOKIE);
  const root = useRef(null);
  const scope = useRef<Scope>(null);

  const handleSubmit = useCallback(
    async (e: TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault();
      if (
        userName?.replace(/\s/g, '').length &&
        !userName.trim().includes(' ')
      ) {
        setInputError('');
        const userN = userName.trim();
        try {
          await setInitialDBdata(userN);
          setCookie(TODO_APP_COOKIE, userName, { expires: '2h' });

          const tl = createTimeline({
            defaults: {
              duration: 1000
            }
          });

          tl.add(scope.current?.root as HTMLElement, {
            scale: 0.92
          })
            .add(
              scope.current?.root as HTMLElement,
              {
                borderWidth: 0,
                ease: 'inOutExpo'
              },
              '-=1000'
            )
            .add(
              scope.current?.root as HTMLElement,
              {
                opacity: 0,
                ease: 'inOutExpo',
                onComplete: () => {
                  route('/dashboard');
                }
              },
              '-=700'
            );
        } catch (e) {
          setInputError(
            'DB アプリケーションエラー、ブラウザーを更新して下さい'
          );
        }
      } else {
        setInputError('スペースは使えません');
      }
    },
    [userName]
  );

  // オペニング アニメーション
  useEffect(() => {
    document.getElementById(APP_ROOT)?.removeAttribute('style');

    if (!userCookie) {
      scope.current = createScope({ root }).add((self) => {
        const tl = createTimeline({ defaults: { duration: 500 } });

        tl.add('.logo', {
          opacity: [0, 1],
          translateY: [32, 0],
          delay: 500
        })
          .add('#loginFormId', {
            // height: [0, 168],
            opacity: [0, 1],
            translateY: {
              to: [180, 0],
              ease: 'inOutBack'
            },
            duration: 900
          })
          .add(
            self.root,
            {
              borderWidth: 16,
              ease: 'inOutExpo'
            },
            '-=600'
          )
          .add(
            ['#appTimerId', '#introFooter'],
            {
              opacity: [0, 1],
              ease: 'inOutQuad'
            },
            '-=500'
          );
      });

      return;
    }

    route('/dashboard');

    return () => scope.current?.revert();
  }, [userCookie]);

  if (userCookie) {
    return null;
  }

  return (
    <div
      className={clsx(style.loginWrap, 'app-page', 'centered')}
      ref={root}
      id="loginPage"
    >
      <Timer fixed={true} className={style.appTimer} />
      <span className={`${style.logo} logo`} ref={logoRef}>
        <Logo title="Todo App" />
      </span>
      <form
        className={style.loginForm}
        id="loginFormId"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <Container title="ログイン">
          <Input
            onInput={(v) => setUserName(v.currentTarget.value)}
            value={userName}
            id="nameInput"
            label="ID"
            setsumei="名前を入力して下さい"
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
          <i className="icon github" title="IrvingArmenta" />
        </a>
      </footer>
    </div>
  );
};

export default Login;
