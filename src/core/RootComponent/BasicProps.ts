import { Dispatch, UnknownAction } from "redux";
import { UserEntity } from "core/Models/UserEntity";
export interface BasicProps {
    dispatch: Dispatch<UnknownAction>;
    currentUser: UserEntity | null;
}
