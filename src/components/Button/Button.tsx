import { clsx } from '@utils';
import type { FunctionalComponent } from 'preact';
import type { HTMLAttributes } from 'preact/compat';
import style from './style.module.css';

type ButtonType = {
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
} & HTMLAttributes<HTMLButtonElement>;

const Button: FunctionalComponent<ButtonType> = ({
  type = 'button',
  ...props
}) => {
  const { disabled, variant, children, className, ...rest } = props;
  return (
    <button
      className={clsx(
        style.btn,
        variant && style[variant],
        disabled && style.isDisabled,
        className
      )}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
