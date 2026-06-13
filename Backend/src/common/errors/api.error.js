export class ApiError extends Error {

    constructor(
        message = "Something went wrong",
        statusCode = 500
    ) {

        super(message);

        this.statusCode = statusCode;

        Error.captureStackTrace(
            this,
            this.constructor
        );
    }
}