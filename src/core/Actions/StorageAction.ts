import { Action } from "redux";
import { StorageType } from "../Models/StorageType";
import { StatesAction } from "./StatesAction";
export class StorageAction<TActionType> implements Action {
  constructor(key: string, storageType: StorageType, value?: any, onSuccess?: (result: any) => StatesAction<TActionType>, onFail?: (message: any) => StatesAction<TActionType>) {
    this.key = key;
    this.storageType = storageType;
    this.value = value;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
  }
  type: string ='';
  isStorage: boolean = true;
  storageType: StorageType;
  key: string;
  value?: any;
  onSuccess?: (result: any) => StatesAction<TActionType>;
  onFail?: (message: any) => StatesAction<TActionType>;
}
