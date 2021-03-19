import { Middleware } from "redux";
import { StorageType } from "core/Models/StorageType";
import { get, set } from "core/Utils/Storage";
import { StorageAction } from "core/Actions/StorageAction";

export const StorageMiddleware: Middleware = api => next => async (action: StorageAction<any>) => {
  if (action.isStorage) {
    try {
      switch (action.storageType) {
        case StorageType.Remove:
          await set(action.key, null);
          action.value= null;
          break;
        case StorageType.Update:
          await set(action.key, action.value);
          break;
        case StorageType.Get:
          action.value = await get(action.key);
          break;
        default:
          break;
      }
      if (action.onSuccess) {
        api.dispatch(action.onSuccess(action.value));
      }  
    } catch (error) {
      if (action.onFail) {
        api.dispatch(action.onFail(error));
      }
    }
    
  } else {
    return next(action);
  }
};