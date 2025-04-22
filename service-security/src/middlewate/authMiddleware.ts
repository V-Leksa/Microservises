import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Middleware для защиты маршрутов
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
        console.log('Ошибка:', err); // Вывод ошибки
        console.log('Пользователь:', user); // Вывод найденного пользователя
        if (err) {
            return res.sendStatus(403); 
        }
        if (!user) {
            return res.sendStatus(401); // Не авторизован
        }
        req.user = user; // Сохранение пользователя в запросе
        console.log('Пользователь успешно аутентифицирован:', req.user);
        next(); 
    })(req, res, next);
};

