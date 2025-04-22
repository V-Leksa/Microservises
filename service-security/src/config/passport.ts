import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import {findUser} from '../shared/findUser';

type DoneCallback = (error: any, user?: any, info?: any) => void;

// Локальная стратегия для аутентификации по логину и паролю
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username: string, password: string, done: DoneCallback) => {
    
    const response = await findUser(username, password);
    console.log(response);

    if (!response) return done(null, false, { message: 'Incorrect username.' });

    if (response.password !== password) return done(null, false, { message: 'Incorrect password.' });

    
    return done(null, response);
}));

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'jwt_secret_token'
};


passport.use(
    new JwtStrategy(jwtOptions, (jwtPayload, done) => {
        try {
            const user = { id: jwtPayload.userId, username: jwtPayload.username, password: jwtPayload.password, role: jwtPayload.role };

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }
        catch( err ) {
            return done(err, false);
        }
    })
);


