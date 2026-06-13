import { ApiResponse } from "../utils/api-response.util.js";

export const errorHandler = (
    err,
    req,
    res,
    next
) => {
    console.error(err);

    return ApiResponse.returnError(res, err.message, null, err.statusCode);
};