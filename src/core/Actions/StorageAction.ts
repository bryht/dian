import { Action } from "redux";
import { StorageType } from "../Models/StorageType";
import { StatesAction } from "./StatesAction";

export class StorageAction<TActionType extends string = string> implements Action {
  constructor(key: string, storageType: StorageType, value?: unknown, onSuccess?: (result: unknown) => StatesAction<TActionType>, onFail?: (message: unknown) => StatesAction<TActionType>) {
    this.key = key;
    this.storageType = storageType;
    this.value = value;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
  }
  type: string = '';
  isStorage: boolean = true;
  storageType: StorageType;
  key: string;
  value?: unknown;
  onSuccess?: (result: unknown) => StatesAction<TActionType>;
  onFail?: (message: unknown) => StatesAction<TActionType>;
}
