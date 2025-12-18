import { Middleware } from "redux";
import { StorageType } from "core/Models/StorageType";
import { get, set } from "core/Utils/Storage";
import { StorageAction } from "core/Actions/StorageAction";

export const StorageMiddleware: Middleware = api => next => async (action: unknown) => {
  const storageAction = action as StorageAction<string>;
  if (storageAction.isStorage) {
    try {
      switch (storageAction.storageType) {
        case StorageType.Remove:
          await set(storageAction.key, null);
          storageAction.value = null;
          break;
        case StorageType.Update:
          await set(storageAction.key, storageAction.value);
          break;
        case StorageType.Get:
          storageAction.value = await get(storageAction.key);
          break;
        default:
          break;
      }
      if (storageAction.onSuccess) {
        api.dispatch(storageAction.onSuccess(storageAction.value) as unknown as { type: string });
      }  
    } catch (error) {
      if (storageAction.onFail) {
        api.dispatch(storageAction.onFail(error) as unknown as { type: string });
      }
    }
    
  } else {
    return next(action);
  }
};