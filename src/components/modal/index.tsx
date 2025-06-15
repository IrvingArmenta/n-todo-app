import { clsx } from '@utils';
import { createTimeline, utils } from 'animejs';
import { Fragment, type FunctionalComponent, type h } from 'preact';
import { createPortal } from 'preact/compat';
import { useRef } from 'preact/hooks';
import { Transition } from 'react-transition-group';
import type { TransitionProps } from 'react-transition-group/Transition';
import { APP_ROOT } from 'src/globals';
import Button from '../button';
import style from './style.module.css';

type ModalType = {
  open?: boolean;
  onModalOpen?: (node: HTMLFormElement) => void;
  onModalClose?: () => void;
  modalHeight?: number;
  modalWidth?: `${number}px`;
  onSubmitButtonClick?: (
    e: h.JSX.TargetedMouseEvent<HTMLButtonElement>
  ) => void;
  onCancelButtonClick?: (
    e: h.JSX.TargetedMouseEvent<HTMLButtonElement>
  ) => void;
  transitionProps?: TransitionProps;
};

const ModalBody: FunctionalComponent<ModalType> = (props) => {
  const {
    children,
    open,
    onModalOpen,
    onModalClose,
    onSubmitButtonClick,
    modalWidth,
    onCancelButtonClick
  } = props;
  const modalWrapRef = useRef<HTMLDialogElement>(null);
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
          const root = document.getElementById(APP_ROOT);
          utils.remove(modalWrapRef.current as HTMLElement);

          const modalTL = createTimeline({
            defaults: {
              ease: 'inOutExpo'
            },
            onBegin: () => {
              if (root) {
                root.setAttribute('aria-hidden', 'true');
                root.classList.add(`${APP_ROOT}--open-modal`);
              }
              if (onModalOpen && modalBodyRef.current) {
                onModalOpen(modalBodyRef.current);
              }
            },
            onComplete: () => {
              const focusable =
                modalBodyRef.current?.querySelectorAll<HTMLElement>(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

              if (focusable) {
                requestAnimationFrame(() => {
                  focusable[0].focus();
                });
              }
            }
          });

          modalTL
            .add('.backdrop', {
              opacity: { from: 0, to: 1 },
              duration: timeout / 2
            })
            .add(
              modalWrapRef.current as HTMLElement,
              {
                scale: { from: 0.92, to: 1 },
                opacity: { from: 0, to: 1 },
                duration: timeout / 2
              },
              '-=300'
            );
        }}
        onExiting={() => {
          utils.remove(modalWrapRef.current as HTMLElement);

          const modalTLExit = createTimeline({
            defaults: {
              ease: 'inOutExpo'
            },
            onComplete: () => {
              const root = document.getElementById(APP_ROOT);
              if (root) {
                root.removeAttribute('aria-hidden');
                root.classList.remove(`${APP_ROOT}--open-modal`);
              }
              if (onModalClose) {
                onModalClose();
              }
            }
          });

          modalTLExit
            .add(modalBodyRef.current as HTMLElement, {
              scale: { from: 1, to: 0.9 },
              opacity: { from: 1, to: 0 },
              duration: 300
            })
            .add(
              '.backdrop',
              {
                opacity: { from: 1, to: 0 },
                duration: timeout / 2
              },
              '-=100'
            );
        }}
      >
        {(state) => {
          return (
            <>
              <span
                aria-hidden={true}
                className={clsx(style.overlay, 'backdrop')}
              />
              <dialog
                ref={modalWrapRef}
                style={{ '--modal-width': modalWidth }}
                className={clsx(
                  style.modalStyle,
                  (state === 'entering' || state === 'entered') &&
                    style.entered,
                  'app-modal'
                )}
                open={state !== 'exited'}
              >
                <form
                  style={{ '--color': '#fff' }}
                  class="pixel-border"
                  onSubmit={(e) => e.preventDefault()}
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
              </dialog>
            </>
          );
        }}
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
