import { UserState } from "./UserState";
export class UserEntity {
    accessToken: string = '';
    expireDate: Date | null = null;
    culture: string | null = null;
    refreshToken: string = '';
    getUserState(): UserState {
        if (!this.accessToken || this.expireDate == null || !this.refreshToken) {
            return UserState.NeedLogin;
        }
        else if (new Date(this.expireDate) < new Date()) {
            return UserState.NeedRefresh;
        }
        else {
            return UserState.Normal;
        }
    }
}
