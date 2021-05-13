import { h } from 'preact';
import { forwardRef, useRef } from 'preact/compat';
import anime from 'animejs';
import { Transition } from 'react-transition-group';
import inputStyle from '../input/style.css';

// eslint-disable-next-line @typescript-eslint/ban-types
const TextArea = forwardRef<
  HTMLTextAreaElement,
  {
    label?: string;
    setsumei?: string | JSX.Element;
    error?: string;
  } & h.JSX.HTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
  const { className, label, setsumei, error, ...rest } = props;
  const errorRef = useRef<HTMLDivElement>(null);

  return (
    <div className={inputStyle.inputWrap}>
      <span className={inputStyle.inputHeader}>
        {label && <label htmlFor={rest.id}>{label}</label>}
        <span>
          {(setsumei || props.maxLength) && (
            <span>
              {setsumei && <span>{setsumei}</span>}
              {props.maxLength && (
                <span>
                  {props.maxLength - String(props.value).length}文字まで
                </span>
              )}
            </span>
          )}
        </span>
      </span>
      <textarea
        ref={ref}
        {...rest}
        className={`${inputStyle.input} ${className || ''}`}
        aria-describedby={error}
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
        <div className={`${inputStyle.error} iconArrow`} ref={errorRef}>
          {error}
        </div>
      </Transition>
    </div>
  );
});

export default TextArea;
