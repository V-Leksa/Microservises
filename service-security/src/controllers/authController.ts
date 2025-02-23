import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    // Сохранение пароля в открытом виде 
    const newUser = new User({ username, password, email });
    
    await newUser.save();
    
    res.json({ message: "User registered successfully", userId: newUser._id });
};

export const login = (req: Request, res: Response) => {
    const token = jwt.sign({ name: req.user }, 'jwt_secret_token'); 
    
    res.json({ accessToken: token });
};
