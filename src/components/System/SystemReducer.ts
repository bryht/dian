
import { UserEntity } from "core/Models/UserEntity";
import { Reducer } from 'redux';
import { StatesAction } from "redux/Actions/StatesAction";
import { SystemActionType } from "./SystemActionType";
import { SystemStates } from "./SystemStates";

export const systemReducer: Reducer<SystemStates, StatesAction<SystemActionType>> = (state = new SystemStates(), action) => {
    switch (action.type) {
        case SystemActionType.SaveUserSuccess:
            return { ...state, currentUser: action.payload as UserEntity }
        case SystemActionType.RemoveCurrentUserSuccess:
            return { ...state, currentUser: null }
        case SystemActionType.ToggleSetting:
            return { ...state, isSettingOpened: !state.isSettingOpened }
            case SystemActionType.DeleteAllHistory:
                return { ...state, historyDeleted:action.payload.historyDeleted }
    }
    return state;
};
