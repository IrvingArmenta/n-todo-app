import { FunctionalComponent, h } from 'preact';
import { useCallback, useRef } from 'preact/hooks';
import Button from '../button';
import style from './style.css';
import Cookies from 'js-cookie';
import Timer from '../timer';
import anime from 'animejs';
import { route } from 'preact-router';
type HeaderType = {
  isLogin?: boolean;
};

const Header: FunctionalComponent<HeaderType> = (props) => {
  const { isLogin } = props;
  const headerRef = useRef<HTMLElement>(null);

  const handleLogout = useCallback(async () => {
    anime({
      targets: document.getElementById('preact_root')?.children,
      keyframes: [{ scale: 0.94 }, { opacity: 0, easing: 'easeInOutQuad' }],
      complete: () => {
        Cookies.remove('TodoApp-User-Cookie', { expires: 7 });
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
      {Cookies.get('TodoApp-User-Cookie') && (
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
