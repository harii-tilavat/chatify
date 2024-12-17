import { io } from 'socket.io-client';
import { UserModel } from '../models/authModel';

const BASE_URL = "http://localhost:8080";


export const initilizeSocket = (user: UserModel) => {
    const socket = io(BASE_URL, {
        query: {
            userId: user.id,
            username: user.fullName
        }
    });
    return socket;
}

