// Interface to validate classes

export interface IClassConstructor {
  new (...args: any[]): unknown;
}
