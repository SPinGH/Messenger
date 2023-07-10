export interface Token {
    token: string;
}

export interface User {
    _id: string;
    username: string;
    isOnline: boolean;
    lastSeen: string;
}

export interface UserInfo {
    user: User;
    users: Record<string, User>;
    newMessages: Record<string, number>;
}

export interface Auth {
    username: string;
    password: string;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}
