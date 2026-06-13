import { ApiResponse } from "../utils/api-response.util.js";

export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return ApiResponse.returnError(
            res,
            "Access denied",
            403
        );
    }
    next();
};