import anime from 'animejs';
import { Fragment, FunctionalComponent, h } from 'preact';
import { createPortal } from 'preact/compat';
import { useRef } from 'preact/hooks';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import Button from '../button';
import style from './style.css';

type ModalType = {
  open?: boolean;
  onModalOpen?: (node: HTMLDivElement) => void;
  onModalClose?: () => void;
  modalHeight?: number;
  onSubmitButtonClick?: (
    e: h.JSX.TargetedMouseEvent<HTMLButtonElement>
  ) => void;
  onCancelButtonClick?: (
    e: h.JSX.TargetedMouseEvent<HTMLButtonElement>
  ) => void;
  transitionProps?: TransitionProps;
};

const ModalBody: FunctionalComponent<ModalType> = ({
  modalHeight = 380,
  ...props
}) => {
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
        timeout={900}
        in={open}
        nodeRef={modalBodyRef}
        mountOnEnter={true}
        unmountOnExit={true}
        onEntering={() => {
          anime.remove(modalBodyRef.current);
          anime({
            targets: modalBodyRef.current,
            height: [0, modalHeight],
            opacity: [0, 1],
            easing: 'easeInOutExpo',
            duration: 900,
            complete: () => {
              document.querySelector('.app-page')?.classList.add('modal-open');
              if (onModalOpen) {
                onModalOpen(modalBodyRef.current);
              }
            }
          });
        }}
        onExiting={() => {
          document.querySelector('.app-page')?.classList.remove('modal-open');
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
        <div
          ref={modalBodyRef}
          className={`${style.modalStyle} pixel-border app-modal`}
        >
          <span role="img" className={style.overlay} />
          <form
            style={{ '--color': '#fff' }}
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
        </div>
      </Transition>
    </Fragment>
  );
};

const Modal: FunctionalComponent<ModalType> = (props) => {
  const container = document.body;
  return (
    <Fragment>{createPortal(<ModalBody {...props} />, container)}</Fragment>
  );
};

export default Modal;
