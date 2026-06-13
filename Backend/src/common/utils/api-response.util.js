export class ApiResponse {
    static returnSuccess(
        res,
        data = null,
        message = "Success",
        statusCode = 200,
        pagination = null
    ) {
        const response = {
            success: true,
            message,
            data
        };

        if (pagination) {
            response.pagination = pagination;
        }

        return res.status(statusCode).json(response);
    }

    static returnError(
        res,
        message = "Something went wrong",
        details = null,
        statusCode = 500
    ) {
        return res.status(statusCode).json({
            success: false,
            message,
            details
        });
    }
}