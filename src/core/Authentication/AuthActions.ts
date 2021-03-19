import { UserEntity } from "core/Models/UserEntity";
import { StatesAction } from "core/Actions/StatesAction";
import { StorageAction } from "core/Actions/StorageAction";
import { StorageType } from "core/Models/StorageType";
import { AuthActionType } from "./AuthActionType";

export class AuthActions {


    static SaveUserSuccess(currentUser: UserEntity): StatesAction<AuthActionType> {
        return {
            type: AuthActionType.SaveUserSuccess,
            payload: currentUser
        }
    }

    static GoLogin(): StatesAction<AuthActionType> {
        return {
            type: AuthActionType.RemoveCurrentUserSuccess,
            payload: null
        }
    }

    static SaveUser(currentUser: UserEntity): StorageAction<AuthActionType> {
        return new StorageAction<AuthActionType>('user',
            StorageType.Update,
            currentUser,
            () => AuthActions.SaveUserSuccess(currentUser));
    }

}