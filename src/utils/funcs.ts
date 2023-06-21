export const doNothing = () => {};

export const inRange = (n: number, min: number, max: number) =>
  (n - min) * (n - max) <= 0;

export const wait = async (ms = 1000): Promise<void> => {
  return new Promise(r => {
    setTimeout(() => {
      r();
    }, ms);
  });
};
