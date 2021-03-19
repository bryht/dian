import { UserEntity } from "core/Models/UserEntity";
import Guid from "core/Utils/Guid";
export class SystemStates {
    currentUser: UserEntity | null = null;
    historyDeletedFlag: string = Guid.newGuid();
}
