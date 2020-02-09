export function StringToBytes(string, byteSize = 32) {
  let inputByte32 = new Uint8Array(byteSize)
  inputByte32.set((new TextEncoder()).encode(string))
  return inputByte32;
}
export function ArrayNumToBytes(childArray, byteSize = 32) {
  let arrayByte = childArray.map(item => {
    if (isNaN(item)) {
      throw "Not a number item: " + item;
    }
    else {
      return Number(item);
    }
  })
  let inputByte32 = new Uint8Array(byteSize)
  if (childArray.length <= byteSize) {
    inputByte32.set(arrayByte);
  }
  else {
    //slice input
    inputByte32.set(childArray.slice(0, byteSize));
  }
  return inputByte32;
}