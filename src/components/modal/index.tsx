import anime from 'animejs';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useRef } from 'preact/hooks';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import Button from '../button';
import style from './style.css';

type ModalType = {
  open?: boolean;
  onModalOpen?: (node: HTMLDivElement) => void;
  onModalClose?: () => void;
  onSubmitButtonClick?: (
    e: h.JSX.TargetedMouseEvent<HTMLButtonElement>
  ) => void;
  onCancelButtonClick?: (
    e: h.JSX.TargetedMouseEvent<HTMLButtonElement>
  ) => void;
  transitionProps?: TransitionProps;
};

const Modal: FunctionalComponent<ModalType> = (props) => {
  const {
    children,
    open,
    onModalOpen,
    onModalClose,
    onSubmitButtonClick,
    onCancelButtonClick
  } = props;
  const modalBodyRef = useRef<HTMLDivElement>(null);
  return (
    <Fragment>
      <Transition
        timeout={1100}
        in={open}
        nodeRef={modalBodyRef}
        mountOnEnter={true}
        unmountOnExit={true}
        onEntering={() => {
          anime.remove(modalBodyRef.current);
          const h = anime.get(modalBodyRef.current, 'height');
          anime({
            targets: modalBodyRef.current,
            height: [0, h],
            opacity: [0, 1],
            easing: 'easeInOutExpo',
            duration: 1100,
            complete: () => {
              if (onModalOpen) {
                onModalOpen(modalBodyRef.current);
              }
            }
          });
        }}
        onExiting={() => {
          anime.remove(modalBodyRef.current);
          anime({
            targets: modalBodyRef.current,
            opacity: 0,
            height: 0,
            easing: 'easeInOutExpo',
            duration: 1100,
            complete: () => {
              if (onModalClose) {
                onModalClose();
              }
            }
          });
        }}
      >
        <div
          style={{ '--color': '#fff' }}
          ref={modalBodyRef}
          className={`${style.modalStyle} pixel-border`}
        >
          {children}
          <div className={style.buttonsWrap}>
            <Button
              onClick={(e) => {
                if (onSubmitButtonClick) {
                  onSubmitButtonClick(e);
                }
              }}
              variant="secondary"
            >
              追加する
            </Button>
            <Button
              onClick={(e) => {
                if (onCancelButtonClick) {
                  onCancelButtonClick(e);
                }
              }}
            >
              キャンセル
            </Button>
          </div>
        </div>
      </Transition>
    </Fragment>
  );
};

export default Modal;
