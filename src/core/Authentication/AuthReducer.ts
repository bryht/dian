
import { UserEntity } from "core/Models/UserEntity";
import { Reducer, UnknownAction } from 'redux';
import { StatesAction } from "core/Actions/StatesAction";
import { AuthActionType } from "./AuthActionType";
import { AuthStates } from "./AuthStates";

export const AuthReducer: Reducer<AuthStates, UnknownAction> = (state = new AuthStates(), action) => {
    const authAction = action as StatesAction<AuthActionType>;
    switch (authAction.type) {
        case AuthActionType.SaveUserSuccess:
            return { ...state, currentUser: authAction.payload as UserEntity }
        case AuthActionType.RemoveCurrentUserSuccess:
            return { ...state, currentUser: null }
    }
    return state;
};
