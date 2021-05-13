import anime from 'animejs';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useRef } from 'preact/hooks';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import Button from '../button';
import style from './style.css';

type ModalType = {
  open?: boolean;
  onModalOpen?: (node: HTMLFormElement) => void;
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
  const modalBodyRef = useRef<HTMLFormElement>(null);
  return (
    <Fragment>
      <Transition
        timeout={900}
        in={open}
        nodeRef={modalBodyRef}
        mountOnEnter={true}
        unmountOnExit={true}
        onEntering={() => {
          anime.remove(modalBodyRef.current);
          anime({
            targets: modalBodyRef.current,
            height: [0, 330],
            opacity: [0, 1],
            easing: 'easeInOutExpo',
            duration: 900,
            complete: () => {
              document.documentElement.classList.add('modal-open');
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
            duration: 900,
            complete: () => {
              if (onModalClose) {
                onModalClose();
              }
            }
          });
        }}
      >
        <form
          style={{ '--color': '#fff' }}
          ref={modalBodyRef}
          className={`${style.modalStyle} pixel-border`}
          onSubmit={(e) => e.preventDefault()}
        >
          {children}
          <div className={style.buttonsWrap}>
            <Button
              onClick={(e) => {
                if (onSubmitButtonClick) {
                  onSubmitButtonClick(e);
                }
              }}
              type="submit"
              variant="secondary"
            >
              OK
            </Button>
            <Button
              onClick={(e) => {
                if (onCancelButtonClick) {
                  onCancelButtonClick(e);
                }
              }}
            >
              CANCEL
            </Button>
          </div>
        </form>
      </Transition>
    </Fragment>
  );
};

export default Modal;
