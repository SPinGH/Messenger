export interface Token {
    token: string;
}

export interface User {
    _id: string;
    username: string;
    isOnline: boolean;
    lastSeen: string;
}

export interface RawUserInfo {
    user: User;
    users: User[];
}

export interface UserInfo {
    user: User;
    users: Record<string, User>;
}

export interface Auth {
    username: string;
    password: string;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}
