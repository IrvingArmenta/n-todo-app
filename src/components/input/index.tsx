import { clsx } from '@utils';
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

type InputProps = {
  label?: string;
  setsumei?: string | ReactNode;
  error?: string;
  value?: string;
  maxLength?: number;
  required?: boolean;
  id: string;
} & HTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    label,
    setsumei,
    error,
    style,
    value,
    maxLength,
    ...rest
  } = props;
  const errorRef = useRef<HTMLDivElement>(null);
  const valueCount =
    typeof value === 'string' ? value.replace(/\s/g, '').length : 0;

  return (
    <div className={styleCss.inputWrap} style={style}>
      <span className={styleCss.inputHeader}>
        {label && <label htmlFor={rest.id}>{label}</label>}
        <span style={{ textAlign: 'right' }}>
          {(setsumei || maxLength) && (
            <Fragment>
              {setsumei && (
                <span style={{ display: 'block', marginBottom: 4 }}>
                  {setsumei}
                </span>
              )}
              {maxLength && (
                <span
                  style={{
                    color: maxLength - valueCount === 0 ? 'red' : 'inherit'
                  }}
                >
                  {maxLength - valueCount}
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
        value={value}
        maxLength={maxLength}
        className={clsx(styleCss.input, className as string)}
      />
      <Transition
        in={Boolean(error)}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={1000}
        nodeRef={errorRef}
        onEntering={() => {
          animate('.iconArrow', {
            height: [0, utils.get('.iconArrow', 'height')],
            opacity: [0, 1],
            marginTop: [0, 8]
          });
        }}
        onExiting={() => {
          animate('.iconArrow', {
            height: 0,
            opacity: 0
          });
        }}
      >
        <div className={clsx(styleCss.error, 'iconArrow')} ref={errorRef}>
          {error}
        </div>
      </Transition>
    </div>
  );
});

export default Input;
