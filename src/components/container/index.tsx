import type { FunctionalComponent } from 'preact';
import type { HTMLAttributes } from 'preact/compat';
import { isSafari } from '../../utils';
import style from './style.module.css';

type ContainerType = {
  title?: string;
} & HTMLAttributes<HTMLFieldSetElement>;

const Container: FunctionalComponent<ContainerType> = (props) => {
  const { title, children, className, ...rest } = props;
  if (title) {
    return (
      <fieldset
        className={`${style.container} ${
          style.withTitle
        } pixel-border app-container ${className || ''}`}
        {...rest}
      >
        <legend
          className={`${style.title} ${
            isSafari() ? style.isSafariBrowser : ''
          }`}
        >
          {title}
        </legend>
        {children}
      </fieldset>
    );
  }
  return <div className={`${style.container} pixel-border`}>{children}</div>;
};

export default Container;
