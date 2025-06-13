import { createTimeline, utils } from 'animejs';
import { Fragment, type FunctionalComponent, type h } from 'preact';
import { createPortal } from 'preact/compat';
import { useRef } from 'preact/hooks';
import { Transition } from 'react-transition-group';
import type { TransitionProps } from 'react-transition-group/Transition';
import Button from '../button';
import style from './style.module.css';
import clsx from '@utils';

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
          utils.remove(modalWrapRef.current as HTMLElement);
          const modalTL = createTimeline({
            defaults: {
              ease: 'inOutExpo'
            },
            onBegin: () => {
              if (root) {
                root.setAttribute('aria-hidden', 'true');
                root.classList.add('preact_root--open-modal');
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
              opacity: [0, 1],
              duration: timeout / 2
            })
            .add(
              modalWrapRef.current as HTMLElement,
              {
                scale: [0.9, 1],
                opacity: [0, 1],
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
            .add(modalBodyRef.current as HTMLElement, {
              scale: 0.8,
              opacity: [1, 0],
              duration: timeout / 2
            })
            .add(
              '.backdrop',
              {
                opacity: [1, 0],
                duration: timeout / 2
              },
              '-=300'
            );
        }}
      >
        <div ref={modalWrapRef} className={clsx(style.modalStyle, 'app-modal')}>
          <span
            aria-hidden={true}
            className={clsx(style.overlay, 'backdrop')}
          />
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
