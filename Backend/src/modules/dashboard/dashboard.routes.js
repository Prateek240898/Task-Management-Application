import express from "express";
import { getDashboard } from "./dashboard.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";

const router =
    express.Router();

router.get(
    "/get-dashboard",
    authenticate,
    getDashboard
);

export default router;