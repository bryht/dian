import { UserEntity } from "core/Models/UserEntity";
import Guid from "utils/Guid";
export class SystemStates {
    currentUser: UserEntity | null = null;
    isSettingOpened: boolean = false;
    historyDeletedFlag: string = Guid.newGuid();
}
