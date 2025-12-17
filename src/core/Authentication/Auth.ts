import { Dispatch, UnknownAction } from "redux";
import { UserState } from "core/Models/UserState";
import { UserEntity } from "core/Models/UserEntity";
import { AuthActions } from "core/Authentication/AuthActions";

export default class Authentication {

    static async checkAuthenticationAsync(dispatch: Dispatch<UnknownAction>, currentUser: UserEntity) {
        if (currentUser == null) {
            dispatch(AuthActions.GoLogin() as unknown as UnknownAction);
            return;
        }
        var currentUserObject = new UserEntity();
        Object.assign(currentUserObject, currentUser);
        var currentUserState = currentUserObject.getUserState();

        if (currentUserState === UserState.NeedRefresh) {
            dispatch(AuthActions.SaveUser(currentUserObject) as unknown as UnknownAction);
        } else if (currentUserState === UserState.NeedLogin) {
            dispatch(AuthActions.GoLogin() as unknown as UnknownAction);
        }
    }

}