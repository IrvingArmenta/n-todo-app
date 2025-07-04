import { clsx } from '@utils';
import type { FunctionalComponent } from 'preact';
import type { HTMLAttributes } from 'preact/compat';
import PlusIcon from '../../assets/img/plus-sign.svg?react';
import style from './style.module.css';

type AddButtonProps = {
  closeMode?: boolean;
  text?: string;
  absolute?: boolean;
  disabled?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

const AddButton: FunctionalComponent<AddButtonProps> = (props) => {
  const { closeMode, text = '追加する', ...rest } = props;
  return (
    <button
      {...rest}
      type="button"
      className={clsx(
        style.addButton,
        style.size,
        closeMode && style.closeMode,
        props.absolute && style.absolute,
        props.disabled && style.isDisabled
      )}
    >
      <span className={style.text}>{text}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        preserveAspectRatio="xMidYMid meet"
        viewBox="10 0 300 300"
        className={style.circle}
      >
        <title>Plus Icon</title>
        <g
          transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <path
            id="AddButtonCircle"
            d="M1300 2950 l0 -50 -150 0 -150 0 0 -50 0 -50 -100 0 -100 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -100 0 -100 -50 0 -50 0 0 -150 0 -150 -50 0 -50 0 0 -300 0 -300 50 0 50 0 0 -150 0 -150 50 0 50 0 0 -100 0 -100 50 0 50 0 0 -50 0 -50 50 0 50 0 0 -50 0 -50 50 0 50 0 0 -50 0 -50 50 0 50 0 0 -50 0 -50 50 0 50 0 0 -50 0 -50 100 0 100 0 0 -50 0 -50 150 0 150 0 0 -50 0 -50 300 0 300 0 0 50 0 50 150 0 150 0 0 50 0 50 100 0 100 0 0 50 0 50 50 0 50 0 0 50 0 50 50 0 50 0 0 50 0 50 50 0 50 0 0 50 0 50 50 0 50 0 0 50 0 50 50 0 50 0 0 100 0 100 50 0 50 0 0 150 0 150 50 0 50 0 0 300 0 300 -50 0 -50 0 0 150 0 150 -50 0 -50 0 0 100 0 100 -50 0 -50 0 0 50 0 50 -50 0 -50 0 0 50 0 50 -50 0 -50 0 0 50 0 50 -50 0 -50 0 0 50 0 50 -50 0 -50 0 0 50 0 50 -100 0 -100 0 0 50 0 50 -150 0 -150 0 0 50 0 50 -300 0 -300 0 0 -50z m600 -100 l0 -50 150 0 150 0 0 -50 0 -50 100 0 100 0 0 -50 0 -50 50 0 50 0 0 -50 0 -50 50 0 50 0 0 -50 0 -50 50 0 50 0 0 -50 0 -50 50 0 50 0 0 -100 0 -100 50 0 50 0 0 -150 0 -150 50 0 50 0 0 -300 0 -300 -50 0 -50 0 0 -150 0 -150 -50 0 -50 0 0 -100 0 -100 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -100 0 -100 0 0 -50 0 -50 -150 0 -150 0 0 -50 0 -50 -300 0 -300 0 0 50 0 50 -150 0 -150 0 0 50 0 50 -100 0 -100 0 0 50 0 50 -50 0 -50 0 0 50 0 50 -50 0 -50 0 0 50 0 50 -50 0 -50 0 0 50 0 50 -50 0 -50 0 0 100 0 100 -50 0 -50 0 0 150 0 150 -50 0 -50 0 0 300 0 300 50 0 50 0 0 150 0 150 50 0 50 0 0 100 0 100 50 0 50 0 0 50 0 50 50 0 50 0 0 50 0 50 50 0 50 0 0 50 0 50 50 0 50 0 0 50 0 50 100 0 100 0 0 50 0 50 150 0 150 0 0 50 0 50 300 0 300 0 0 -50z"
          />
        </g>
      </svg>
      <PlusIcon className={style.plus} />
    </button>
  );
};

export default AddButton;
