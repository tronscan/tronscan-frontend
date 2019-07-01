export function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
export function waitFor(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
