import { animate } from 'animejs';
import type { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useCallback, useRef } from 'preact/hooks';
import { getCookie, removeCookie } from 'tiny-cookie';
import { APP_ROOT, TODO_APP_COOKIE } from '../../globals';
import Button from '../button';
import Timer from '../timer';
import style from './style.module.css';
type HeaderType = {
  isLogin?: boolean;
};

const Header: FunctionalComponent<HeaderType> = (props) => {
  const { isLogin } = props;
  const headerRef = useRef<HTMLElement>(null);

  const handleLogout = useCallback(async () => {
    animate('.app-page', {
      keyframes: [{ scale: 0.94 }, { opacity: 0, ease: 'inOutQuad' }],
      onComplete: () => {
        removeCookie(TODO_APP_COOKIE);
        route('/', true);
      }
    });
  }, []);

  // ログインページなら見せない
  if (isLogin) {
    return null;
  }

  return (
    <header class={style.header} ref={headerRef}>
      <Timer />
      {getCookie(TODO_APP_COOKIE) && (
        <nav>
          <Button style={{ whiteSpace: 'nowrap' }} onClick={handleLogout}>
            ログアウト
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
