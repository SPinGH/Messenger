import { User } from '@/entities/User';

export interface Group {
    _id: string;
    name: string;
    users: string[];
    lastMessage?: Message;
    isDialog: boolean;
}

export interface GroupRequest {
    _id?: string;
    name: string;
    users: User[];
    isDialog: boolean;
}

export interface Message {
    _id: string;
    date: string;
    author: string;
    text: string;
    group: string;
}

export interface MessageRequest {
    group: string;
    text: string;
}
