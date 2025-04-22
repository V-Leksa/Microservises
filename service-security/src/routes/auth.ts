import express from 'express';
import passport from 'passport';
import { register, login, protectedRoute, updateTokens, guestTokenCreate } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.post('/refresh-token', updateTokens);
router.get('/guest-token', guestTokenCreate);

router.get('/protected', passport.authenticate('jwt', { session: false }), protectedRoute);


export default router;
