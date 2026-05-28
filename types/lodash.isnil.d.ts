declare module 'lodash.isnil' {
  function isNil(value: unknown): value is null | undefined;

  export = isNil;
}
