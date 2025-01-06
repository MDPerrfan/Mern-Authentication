import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../nodemailer/nodemailer.js';

export const register = async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }
    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword })
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Hello World!',
            text: `Welcome ${name}. Your account has been created with email id ${email}`
        }
        await transporter.sendMail(mailOptions);

        return res.json({ success: true })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
export const login = async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "Missing Credentials" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect Password!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const logout = async(req, res) => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            })
            return res.json({ success: true, message: "Logged Out!" })
        } catch (error) {
            return res.json({ success: false, message: error.message })
        }
    }
    //send verification OTP to the user's email
export const sendVerfiyOtp = async(req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId);
        if (user.isVerified) {
            return res.json({ success: false, message: "Account already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp;
        user.verifyOtpExpired = Date.now() + 24 * 60 * 60 * 1000;
        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP`
        }
        await transporter.sendMail(mailOption);
        return res.json({ success: true, message: "Verification OTP has sent!" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
export const verfiyEmail = async(req, res) => {
        const { userId, otp } = req.body
        if (!userId || !otp) {
            return res.json({ success: false, message: "Missing Details" })
        }
        try {
            const user = await userModel.findById(userId);
            console.log(user.name);

            if (!user) {
                return res.josn({ success: false, message: "User not found!" })
            }
            if (user.verifyOtp === '' || user.verifyOtp !== otp) {
                return res.json({ success: false, message: "Invalid OTP!" })
            }
            if (user.verifyOtpExpired < Date.now()) {
                return res.json({ success: false, message: "OTP Expired!" })
            }

            user.isVerified = true;
            user.verifyOtp = '';
            user.verifyOtpExpired = 0;


            await user.save();
            return res.json({ success: true, message: "Email verified successfully" })
        } catch (error) {
            return res.json({ success: false, message: error.message })
        }
    }
    //check if the user is authenticated
export const isAuthenticated = async(req, res) => {
    try {

        return res.json({ success: true, message: "User is authenticated!" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

//send password reset otp
export const sendResetOtp = async(req, res) => {
        const { email } = req.body

        if (!email) {
            return res.json({ success: false, message: "Email is required." })
        }
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.json({ success: false, message: "User is not available!" })
            }
            const otp = String(Math.floor(100000 + Math.random() * 900000))
            user.resetOtp = otp;
            user.resetOtpExpired = Date.now() + 15 * 60 * 1000;
            await user.save()

            const mailOption = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Password reset OTP',
                text: `Your OTP is ${otp}. Reset your password using this OTP`
            }
            await transporter.sendMail(mailOption);
            return res.json({ success: true, message: "Password reset OTP has sent!" })
        } catch (error) {
            return res.json({ success: false, message: error.message })
        }

    }
    //reset user password
export const resetPassword = async(req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email,OTP and new password is required" })
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.json({ success: false, message: "User not found" })
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
        return res.json({ success: false, message: "Invalid OTP" })
    }
    if (user.resetOtpExpired < Date.now()) {
        return res.json({ success: false, message: "OTP Expired!" })

    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpired = 0;
    await user.save();
    return res.json({ success: true, message: "Password has been reset successfully!" })
}