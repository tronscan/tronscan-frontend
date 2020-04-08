export function Try(func) {
  try {
    func();
  } catch (e) {
    // ignore
  }
}