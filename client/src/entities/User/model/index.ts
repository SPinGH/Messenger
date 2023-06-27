export interface User {
    _id: string;
    username: string;
}

export interface Auth {
    username: string;
    password: string;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}
