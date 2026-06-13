import User from "../../modules/users/user.model.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { verifyToken } from "../utils/jwt.util.js";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return ApiResponse.returnError(
                res,
                "Authentication required",
                401
            );
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return ApiResponse.returnError(
                res,
                "User not found",
                401
            );
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};