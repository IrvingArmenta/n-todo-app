import { animate, utils } from 'animejs';
import { Fragment } from 'preact';
import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useRef
} from 'preact/compat';
import { Transition } from 'react-transition-group';
import styleCss from './style.module.css';

// eslint-disable-next-line @typescript-eslint/ban-types
const Input = forwardRef<
  HTMLInputElement,
  {
    label?: string;
    setsumei?: string | ReactNode;
    error?: string;
    value?: string;
    maxLength?: number;
    required?: boolean;
  } & HTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const { className, label, setsumei, error, style, ...rest } = props;
  const errorRef = useRef<HTMLDivElement>(null);
  const valueCount =
    typeof props.value === 'string' ? props.value.replace(/\s/g, '').length : 0;

  return (
    <div className={styleCss.inputWrap} style={style}>
      <span className={styleCss.inputHeader}>
        {label && <label htmlFor={rest.id}>{label}</label>}
        <span style={{ textAlign: 'right' }}>
          {(setsumei || props.maxLength) && (
            <Fragment>
              {setsumei && (
                <span style={{ display: 'block', marginBottom: 4 }}>
                  {setsumei}
                </span>
              )}
              {props.maxLength && (
                <span
                  style={{
                    color:
                      props.maxLength - valueCount === 0 ? 'red' : 'inherit'
                  }}
                >
                  {props.maxLength - valueCount}
                  文字まで
                </span>
              )}
            </Fragment>
          )}
        </span>
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
        onEntering={(node) => {
          console.log(node);
          animate('.iconArrow', {
            height: [0, utils.get('.iconArrow', 'height')],
            opacity: [0, 1],
            marginTop: [0, 8]
          });
        }}
        onExit={() => {
          animate('.iconArrow', {
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
