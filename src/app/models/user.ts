export interface User{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    code?:number;
    username: string;
    password?: string;
}