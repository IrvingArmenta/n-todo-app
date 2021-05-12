import { FunctionalComponent, h } from 'preact';
import { useLocation, useHistory } from 'react-router-dom';
import { useCallback, useRef } from 'preact/hooks';
import Button from '../button';
import style from './style.css';
import Cookies from 'js-cookie';
import Timer from '../timer';
import anime from 'animejs';
type HeaderType = {
  isLogin?: boolean;
};

const Header: FunctionalComponent<HeaderType> = () => {
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const history = useHistory();
  console.log(location);

  const handleLogout = useCallback(async () => {
    anime({
      targets: [document.getElementById('dashboardPage'), headerRef.current],
      keyframes: [{ scale: 0.9 }, { opacity: 0, easing: 'easeInOutQuad' }],
      complete: () => {
        Cookies.remove('TodoApp-User-Cookie', { expires: 7 });
        history.push('/');
      }
    });
  }, [history]);

  // ログインページなら見せない
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header class={style.header} ref={headerRef}>
      <Timer />
      <nav>
        <Button onClick={handleLogout}>ログアウト</Button>
      </nav>
    </header>
  );
};

export default Header;
