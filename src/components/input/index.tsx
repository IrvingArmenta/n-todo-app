import { h } from 'preact';
import styleCss from './style.css';
import { forwardRef, useRef } from 'preact/compat';
import { Transition } from 'react-transition-group';
import anime from 'animejs';

// eslint-disable-next-line @typescript-eslint/ban-types
const Input = forwardRef<
  HTMLInputElement,
  {
    label?: string;
    setsumei?: string | JSX.Element;
    error?: string;
  } & h.JSX.HTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const { className, label, setsumei, error, style, ...rest } = props;
  const errorRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styleCss.inputWrap} style={style}>
      <span className={styleCss.inputHeader}>
        {label && <label htmlFor={rest.id}>{label}</label>}
        {setsumei && <span>{setsumei}</span>}
      </span>
      <input
        ref={ref}
        {...rest}
        className={`${styleCss.input} ${className || ''}`}
      />
      <Transition
        in={Boolean(error)}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={1000}
        nodeRef={errorRef}
        onEntering={() => {
          anime({
            targets: errorRef.current,
            height: [0, anime.get(errorRef.current, 'height')],
            opacity: [0, 1],
            marginTop: [0, 8]
          });
        }}
        onExit={() => {
          anime({
            targets: errorRef.current,
            height: 0,
            opacity: 0
          });
        }}
      >
        <div className={`${styleCss.error} iconArrow`} ref={errorRef}>
          {error}
        </div>
      </Transition>
    </div>
  );
});

export default Input;
