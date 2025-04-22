import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { IUser } from '../shared/findUser';
import axios from 'axios';

export const register = async (req: Request, res: Response) => {
    const { username, email, password, first_name, last_name, phone_number, address, city, state, zip_code, country, create_at, updated_at, role } = req.body;

    const response = (await axios.post('http://users-service:3000/users/new',  req.body)).data;

    if (response) {
        const userId: number = response.id;
        const newUser = new User({
            userId: userId
        });
        await newUser.save();

    }

      
    res.json({ message: "User registered successfully", userId: response});
};

export const guestTokenCreate: (req: Request, res: Response) => void = async (req: Request, res: Response)  => {
    const token = jwt.sign({userId: 0, username: 'guest', password: 'guest', role: 'guest'}, 'jwt_secret_token');
    console.log(token);

    return res.json({guestToken: token});
}

export const login = async (req: Request, res: Response) => {
    let token; 
    let refreshToken;
    

    const currentUser = req.user as IUser | undefined;
    
    if (currentUser) {
        console.log(currentUser.id);
        token = jwt.sign({userId: currentUser.id, username: currentUser.username, password: currentUser.password, role: currentUser.role}, 'jwt_secret_token');
        refreshToken = jwt.sign({userId: currentUser.id}, 'bad_boy', { expiresIn: '30d'});

        await User.findOneAndUpdate({userId: currentUser.id, jwToken: token}).exec();

        const users = await User.find();
        console.log(users);

    }
    console.log(token);
    
    res.json({ accessToken: token, refreshToken: refreshToken });
};


// обновление токена
export const updateTokens = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            res.status(401).json({ message: 'Refresh token is missing' });
        }

        const decoded = jwt.verify(refreshToken, 'bad_boy') as jwt.JwtPayload;

        const newAccessToken = jwt.sign({
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role
        }, 'jwt_secret_token', { expiresIn: '15m' }); 

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Refresh token expired' });
        }

        if (err instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid refresh token' });
        }

        console.error(err);
            res.status(500).json({ message: 'Internal server error' });
    }
}

export const protectedRoute: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    return res.json({
        message: "Access to protected route has granted",
        user: req.user
    });
};
