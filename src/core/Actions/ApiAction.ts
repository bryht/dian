import { Action } from "redux";
import { StatesAction } from "./StatesAction";

export class ApiAction<Type extends string = string> implements Action {
  constructor(url: string, method: string = 'GET', onSuccessType?: Type, onStartType?: Type) {
    this.url = url;
    this.method = method;
    if (onStartType) {
      this.onStart = { type: onStartType };
    }
    if (onSuccessType) {
      this.onSuccess = { type: onSuccessType };
    }
  }
  result: unknown;
  body: unknown;
  url: string | null;
  type: string = 'api';
  private _value: unknown = null;
  get value(): unknown {
    return this._value;
  }
  set value(newValue: unknown) {
    this._value = newValue;
    if (this.onSuccess) {
      this.onSuccess.payload = newValue;
    }
  }
  public method: string = '';
  onStart?: StatesAction<Type>;
  onSuccess?: StatesAction<Type>;
}
