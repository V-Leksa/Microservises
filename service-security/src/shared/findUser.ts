import axios from "axios";

export const findUser = async (username: string, password: string) => {
    const users: IUser[] = (await axios.get('http://users-service:3000/users/allByDb')).data;

    const user: IUser | undefined = users.find(user => user.username === username && user.password === password )

    return user;
}


export interface IUser {
    id: number;
    username: string;
    password: string;
    role: string;
}