import type { RefObject } from 'react';
import useEventListener from './useEventListener';

type EventType =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout';

/**
 * Custom hook that handles clicks outside a specified element.
 * @param ref - ref for the element that will be evaluated
 * @param handler - callback function that triggers when the click happens
 * @param eventType - type of event
 * @param eventListenerOptions - options that can be attached to the event listener
 *
 * @url https://usehooks-ts.com/react-hook/use-on-click-outside
 */
function useOnClickAway<T extends HTMLElement = HTMLElement>(
  reference: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = 'mousedown',
  eventListenerOptions: AddEventListenerOptions = {}
): void {
  useEventListener(
    eventType,
    (event) => {
      const target = event.target as Node;

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected) {
        return;
      }

      const isOutside = Array.isArray(reference)
        ? reference
            .filter((r) => Boolean(r.current))
            .every((r) => r.current && !r.current.contains(target))
        : reference.current && !reference.current.contains(target);

      if (isOutside) {
        handler(event);
      }
    },
    undefined,
    eventListenerOptions
  );
}

export default useOnClickAway;
