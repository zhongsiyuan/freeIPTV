/**
 * debounce
 * @param caller
 * @param delay
 * @param timerGetter
 * @return {(function(): void)|*}
 */
export default (caller, delay = 200, timerGetter = () => undefined) => {
  const timeoutRef = { current: null };

  return function () {
    const ctx = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      caller.apply(ctx, args);
      timeoutRef.current = null;
    }, delay);

    timerGetter?.(timeoutRef);
  };
};
