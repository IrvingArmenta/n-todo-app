export const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

export const isBrowser = typeof window !== 'undefined';
