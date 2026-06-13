import { ApiResponse } from "../utils/api-response.util.js";

export const notFoundHandler = (req, res) => {
    return ApiResponse.returnError(
        res,
        `Route Not Found : ${req.originalUrl}`,
        404
    );
};