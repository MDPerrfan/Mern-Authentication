import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerfiyOtp, verfiyEmail } from '../Controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/sendOtp', userAuth, sendVerfiyOtp);
authRouter.post('/verify-email', userAuth, verfiyEmail)
authRouter.get('/is-auth', userAuth, isAuthenticated)
authRouter.post('/reset-pass-otp', sendResetOtp)
authRouter.post('/change-pass', resetPassword)


export default authRouter;