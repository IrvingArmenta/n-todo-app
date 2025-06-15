export const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

export const isBrowser = typeof window !== 'undefined';

export const isSafari = () => {
  if (isBrowser) {
    return (
      !!navigator.userAgent.match(/safari/i) &&
      !navigator.userAgent.match(/chrome/i) &&
      typeof document.body.style.webkitFilter !== 'undefined' &&
      !window.chrome
    );
  }
};

export const itsNotEmpty = (str: string) => {
  return str.replace(/\s/g, '').length !== 0;
};

/**
 * Filters out falsy values from class names and joins them into a single string.
 *
 * @param {...(string | boolean | undefined | null)[]} classNames - Class names to filter and join.
 * @returns {string} A string of valid class names separated by spaces.
 *
 * @example
 * const className = clsx('btn', isActive && 'btn-active', undefined, false, 'btn-primary');
 * // className will be 'btn btn-active btn-primary' if isActive is true
 */
export function clsx(...classNames: (string | boolean | undefined | null)[]) {
  return classNames
    .map((cls) => (cls === '' ? undefined : cls))
    .filter(
      (className) => typeof className === 'string' && className.length > 0
    )
    .join(' ');
}
