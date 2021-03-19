import { Action } from "redux";
export interface StatesAction<Type> extends Action {
  type: Type | null;
  payload: any | null;
}
