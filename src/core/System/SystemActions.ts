import { UserEntity } from "core/Models/UserEntity";
import { StatesAction } from "core/Actions/StatesAction";
import { StorageAction } from "core/Actions/StorageAction";
import { StorageType } from "core/Models/StorageType";
import { SystemActionType } from "./SystemActionType";

export class SystemActions {


    static SaveUserSuccess(currentUser: UserEntity): StatesAction<SystemActionType> {
        return {
            type: SystemActionType.SaveUserSuccess,
            payload: currentUser
        }
    }

    static GoLogin(): StatesAction<SystemActionType> {
        return {
            type: SystemActionType.RemoveCurrentUserSuccess,
            payload: null
        }
    }

    static SaveUser(currentUser: UserEntity): StorageAction<SystemActionType> {
        return new StorageAction<SystemActionType>('user',
            StorageType.Update,
            currentUser,
            () => SystemActions.SaveUserSuccess(currentUser));
    }

}