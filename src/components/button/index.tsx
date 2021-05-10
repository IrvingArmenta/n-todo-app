import { FunctionalComponent, h } from 'preact';
import style from './style.css';

type ButtonType = {
  variant?: 'primary' | 'secondary';
} & h.JSX.HTMLAttributes<HTMLButtonElement>;

const Button: FunctionalComponent<ButtonType> = ({
  type = 'button',
  ...props
}) => {
  const { disabled, variant, children } = props;
  return (
    <button
      className={`${style.btn} ${variant ? style[variant] : ''} ${
        disabled ? style.isDisabled : ''
      } ${props.className || ''}`}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
