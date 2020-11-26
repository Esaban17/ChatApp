import { User } from './user';

export interface Contact {
    id: string;
    owner: string;
    friend: User;
}