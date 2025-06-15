import { animate, utils } from 'animejs';
import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useRef
} from 'preact/compat';
import { Transition } from 'react-transition-group';
import inputStyle from '../input/style.module.css';

type TextareaProps = {
  label?: string;
  setsumei?: string | ReactNode;
  error?: string;
  maxLength?: number;
  value?: string;
  id: string;
} & HTMLAttributes<HTMLTextAreaElement>;

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
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
            animate(errorRef.current as HTMLElement, {
              height: [0, utils.get(errorRef.current as HTMLElement, 'height')],
              opacity: [0, 1],
              marginTop: [0, 8]
            });
          }}
          onExit={() => {
            animate(errorRef.current as HTMLElement, {
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
  }
);

export default TextArea;
