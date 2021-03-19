import { Dispatch } from "redux";
import { UserState } from "core/Models/UserState";
import { UserEntity } from "core/Models/UserEntity";
import { AuthActions } from "core/Authentication/AuthActions";

export default class Authentication {


    static getConfig(id: string) {
        return {}
    }

    static async loginAsync(id: string): Promise<any | null> {

        return null;
    }

    static async refreshAsync(id: string, refreshToken: string) {

        return null;
    }

    static async checkAuthenticationAsync(dispatch: Dispatch, currentUser: UserEntity) {
        if (currentUser == null) {
            dispatch(AuthActions.GoLogin());
            return;
        }
        var currentUserObject = new UserEntity();
        Object.assign(currentUserObject, currentUser);
        var currentUserState = currentUserObject.getUserState();

        if (currentUserState === UserState.NeedRefresh) {
            //save user logic
            dispatch(AuthActions.SaveUser(currentUserObject));
        } else if (currentUserState === UserState.NeedLogin) {
            dispatch(AuthActions.GoLogin());
        }
    }

}