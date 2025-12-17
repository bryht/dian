import { Action } from "redux";
export interface StatesAction<Type extends string = string> extends Action<Type> {
  type: Type;
  payload?: unknown;
}
