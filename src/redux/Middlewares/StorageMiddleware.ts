import { Middleware } from "redux";
import { StorageType } from "core/Models/StorageType";
import Consts from "core/Consts";


export const StorageMiddleware: Middleware = api => next => action => {
  if (action.type === Consts.storage) {
    switch (action.storageType) {
      case StorageType.Add:
        //save item

        break;
      case StorageType.Remove:
        //remove item

        break;
      default:
        break;
    }
  } else {
    return next(action);
  }
};