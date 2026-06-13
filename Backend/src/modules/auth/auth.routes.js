import express from "express";

import {
    register,
    login,
    logout,
    getCurrentUser
} from "./auth.controller.js";

import {
    authenticate
} from "../../common/middlewares/auth.middleware.js";

const router =
    express.Router();

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);

router.post(
    "/logout",
    authenticate,
    logout
);

router.get(
    "/current-user",
    authenticate,
    getCurrentUser
);

export default router;