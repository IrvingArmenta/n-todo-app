import { animate } from 'animejs';
import type { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useRef } from 'preact/hooks';
import Button from '../../components/button';
import style from './style.module.css';

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
          animate(errorPageRef.current as HTMLElement, {
            translateX: 32,
            opacity: 0,
            duration: 800,
            ease: 'inOutExpo',
            onComplete: () => {
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
