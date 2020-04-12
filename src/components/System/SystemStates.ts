import { UserEntity } from "core/Models/UserEntity";
export class SystemStates {
    currentUser: UserEntity | null = null;
    isSettingOpened: boolean = false;
    historyDeleted: () => void = () => { };
}
