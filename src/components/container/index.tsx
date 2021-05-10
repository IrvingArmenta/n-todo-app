import { FunctionalComponent, h } from 'preact';
import style from './style.css';

type ContainerType = {
  align?: 'left' | 'right' | 'centered';
  title?: string;
};

const Container: FunctionalComponent<ContainerType> = (props) => {
  const { align, title, children } = props;
  if (title) {
    return (
      <fieldset
        className={`${style.container} ${style.withTitle} pixel-border app-container`}
      >
        <legend className={style.title}>{title}</legend>
        {children}
      </fieldset>
    );
  }
  return <div className={`${style.container}pixel-border`}>{children}</div>;
};

export default Container;
