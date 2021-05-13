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
