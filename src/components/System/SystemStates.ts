import { UserEntity } from "core/Models/UserEntity";
import Guid from "utils/Guid";
export class SystemStates {
    currentUser: UserEntity | null = null;
    historyDeletedFlag: string = Guid.newGuid();
}
