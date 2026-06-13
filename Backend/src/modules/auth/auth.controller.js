import AuthService from "./auth.service.js";

import {
    ApiResponse
} from "../../common/utils/api-response.util.js";

import {
    asyncHandler
} from "../../common/utils/async-handler.util.js";

import {
    setAuthCookie,
    clearAuthCookie
} from "../../common/utils/cookie.util.js";

export const register =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const {
                fullName,
                username,
                email,
                password
            } = req.body;

            if (
                !fullName ||
                !username ||
                !email ||
                !password
            ) {

                return ApiResponse.returnError(
                    res,
                    "Full Name, Username, Email and Password are required",
                    null,
                    400
                );
            }

            const user =
                await AuthService.register(
                    req.body
                );

            return ApiResponse.returnSuccess(
                res,
                {
                    id: user._id,
                    fullName:
                        user.fullName,
                    username:
                        user.username,
                    email:
                        user.email,
                    role:
                        user.role
                },
                "Registration successful",
                201
            );
        }
    );

export const login =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const {
                loginId,
                password
            } = req.body;

            if (
                !loginId ||
                !password
            ) {

                return ApiResponse.returnError(
                    res,
                    "Username/Email and Password are required",
                    null,
                    400
                );
            }

            const {
                token,
                user
            } =
                await AuthService.login(
                    loginId,
                    password
                );

            setAuthCookie(
                res,
                token
            );

            return ApiResponse.returnSuccess(
                res,
                {
                    id: user._id,
                    fullName:
                        user.fullName,
                    username:
                        user.username,
                    email:
                        user.email,
                    role:
                        user.role
                },
                "Login successful"
            );
        }
    );

export const logout =
    asyncHandler(
        async (
            req,
            res
        ) => {

            clearAuthCookie(
                res
            );

            return ApiResponse.returnSuccess(
                res,
                null,
                "Logout successful"
            );
        }
    );

export const getCurrentUser =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const user =
                await AuthService.getCurrentUser(
                    req.user._id
                );

            return ApiResponse.returnSuccess(
                res,
                user,
                "User fetched successfully"
            );
        }
    );