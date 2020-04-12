import { Action } from "redux";
import { StorageType } from "../../core/Models/StorageType";
import { StatesAction } from "./StatesAction";
export class StorageAction<TValue, TActionType> implements Action {
  constructor(key: string, storageType: StorageType, value?: TValue | null, onSuccess?: StatesAction<TActionType>, onFail?: StatesAction<TActionType>) {
    this.key = key;
    this.storageType = storageType;
    this.value = value;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
  }
  type: string = 'storage';
  storageType: StorageType;
  key: string;
  value?: TValue | null;
  onSuccess?: StatesAction<TActionType> = { type: null, payload: null };
  onFail?: StatesAction<TActionType> = { type: null, payload: null };
}
