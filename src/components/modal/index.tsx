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
  onModalOpen?: (node: HTMLFormElement) => void;
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

const ModalBody: FunctionalComponent<ModalType> = ({ ...props }) => {
  const {
    children,
    open,
    onModalOpen,
    onModalClose,
    onSubmitButtonClick,
    onCancelButtonClick
  } = props;
  const modalWrapRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLFormElement>(null);
  const timeout = 800;
  return (
    <Fragment>
      <Transition
        timeout={{ enter: timeout, exit: timeout - 300 }}
        in={open}
        nodeRef={modalWrapRef}
        mountOnEnter={true}
        unmountOnExit={true}
        onEntering={() => {
          const root = document.getElementById('preact_root');
          anime.remove(modalWrapRef.current);
          const modalTL = anime.timeline({
            easing: 'easeInOutExpo',
            begin: () => {
              if (root) {
                root.setAttribute('aria-hidden', 'true');
                root.classList.add('preact_root--open-modal');
              }
              if (onModalOpen && modalBodyRef.current) {
                onModalOpen(modalBodyRef.current);
              }
            },
            complete: () => {
              const focusable =
                modalBodyRef.current?.querySelectorAll<HTMLElement>(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

              if (focusable) {
                focusable[0].focus();
              }
            }
          });
          modalTL
            .add({
              targets: modalWrapRef.current,
              opacity: [0, 1],
              duration: timeout / 2
            })
            .add(
              {
                targets: modalBodyRef.current,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: timeout / 2
              },
              '-=300'
            );
        }}
        onExiting={() => {
          anime.remove(modalWrapRef.current);

          const modalTLExit = anime.timeline({
            easing: 'easeInOutExpo',
            complete: () => {
              const root = document.getElementById('preact_root');
              if (root) {
                root.removeAttribute('aria-hidden');
                root.classList.remove('preact_root--open-modal');
              }
              if (onModalClose) {
                onModalClose();
              }
            }
          });
          modalTLExit
            .add({
              targets: modalBodyRef.current,
              scale: 0.8,
              opacity: 0,
              duration: timeout / 2
            })
            .add(
              {
                targets: modalWrapRef.current,
                opacity: [1, 0],
                duration: timeout / 2
              },
              '-=300'
            );
        }}
      >
        <div ref={modalWrapRef} className={`${style.modalStyle} app-modal`}>
          <span role="img" className={style.overlay} />
          <form
            style={{ '--color': '#fff' }}
            class="pixel-border"
            onSubmit={(e) => e.preventDefault()}
            role="dialog"
            ref={modalBodyRef}
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
