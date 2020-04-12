import { Dispatch } from "redux";
import { UserEntity } from "core/Models/UserEntity";
export interface BasicProps {
    dispatch: Dispatch;
    currentUser: UserEntity | null;
}
