import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { JwtFromRequestFunction, VerifiedCallback } from 'passport-jwt';

// Middleware для защиты маршрутов
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403); 
        }
        if (!user) {
            return res.sendStatus(401); // Не авторизован
        }
        req.user = user; // Сохранение пользователя в запросе
        next(); 
    })(req, res, next);
};

