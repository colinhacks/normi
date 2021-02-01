export namespace util {
  export const isPrimitive = (val: any) => val !== Object(val);

  export function isPlainObj(o: any): o is Record<string, unknown> {
    return o !== null && typeof o === 'object' && o!.constructor === Object;
  }
}
