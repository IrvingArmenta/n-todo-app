import { FunctionalComponent, h } from 'preact';
import PlusIcon from '../../assets/img/plus-sign.svg';
import style from './style.css';

const AddButton: FunctionalComponent<
  {
    closeMode?: boolean;
    text?: string;
    absolute?: boolean;
  } & h.JSX.HTMLAttributes<HTMLButtonElement>
> = ({ text = '追加する', ...props }) => {
  const { closeMode, ...rest } = props;
  return (
    <button
      {...rest}
      className={`${style.addButton} ${style.size} ${
        closeMode ? style.closeMode : ''
      } ${props.absolute ? style.absolute : ''} ${
        props.disabled ? style.isDisabled : ''
      }`}
    >
      <span className={style.text}>{text}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        preserveAspectRatio="xMidYMid meet"
        viewBox="10 0 300 300"
        className={`${style.circle} ${style.size}`}
      >
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
