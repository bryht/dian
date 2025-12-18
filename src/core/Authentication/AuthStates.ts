import { UserEntity } from "core/Models/UserEntity";

export class AuthStates {
    currentUser: UserEntity | null = null;
    historyDeletedFlag: string = crypto.randomUUID();
}
