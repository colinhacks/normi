export namespace util {
  export const randomId = () =>
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);

  export const isPrimitive = (val: any) => val !== Object(val);
}
