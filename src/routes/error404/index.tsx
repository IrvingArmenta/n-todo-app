import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import style from './style.css';
import Button from '../../components/button';
import { useRef } from 'preact/hooks';
import anime from 'animejs';

const Error404: FunctionalComponent = () => {
  const errorPageRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={errorPageRef}
      className={`${style.errorPageWrap} app-page centered`}
    >
      <span>〠</span>
      <h1 style={{ color: 'red' }}>404 エラー</h1>
      <p>ページが表示できません</p>
      <Button
        variant="primary"
        onClick={() => {
          anime({
            targets: errorPageRef.current,
            translateX: 32,
            opacity: 0,
            duration: 800,
            easing: 'easeInOutExpo',
            complete: () => {
              route('/');
            }
          });
        }}
      >
        ログインページへ
      </Button>
    </div>
  );
};

export default Error404;
