import userModel from "../models/userModel.js";

export const getUserData = async(req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User is not available." })
        }
        return res.json({
            success: true,
            userData: {
                name: user.name,
                isVerified: user.isVerified,

            }
        })
    } catch (error) {
        return res.json({ success: false, message: message.error })
    }
}