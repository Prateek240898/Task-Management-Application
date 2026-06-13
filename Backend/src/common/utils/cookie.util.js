import { cookieOptions } from "../../configs/cookie.config.js";

export const setAuthCookie = (res, token) => {
    res.cookie("accessToken", token, cookieOptions);
};

export const clearAuthCookie = (res) => {
    res.clearCookie("accessToken", cookieOptions);
};