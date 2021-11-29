// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

export interface IParamsServiceLoginAuth {
  username: string;
  password: string;
}

export interface IResultServiceLoginAuth {
  token: string;
}
