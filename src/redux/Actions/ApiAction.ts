import { Action } from "redux";
import { StatesAction } from "./StatesAction";
export class ApiAction<Type> implements Action {
  constructor(url: string, method: string = 'GET', onSuccessType: Type | null = null, onStartType: Type | null) {
    this.url = url;
    this.onStart.type = onStartType;
    this.onSuccess.type = onSuccessType;
    this.method = method;
  }
  result: any;
  body: any;
  url: string | null;
  type: string = 'api';
  private _value: any | null = null;
  get value(): any | null {
    return this._value;
  }
  set value(newValue: any) {
    this._value = newValue;
    this.onSuccess.payload = newValue;
  }
  public method: string = '';
  onStart: StatesAction<Type> = { type: null, payload: null };
  onSuccess: StatesAction<Type> = { type: null, payload: null };
}
