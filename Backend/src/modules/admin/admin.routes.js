import express from "express";
import {
    createManager,
    updateManager,
    deleteManager,
    getManagerById,
    getManagers
} from "./admin.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { authorize } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/constants/roles.constant.js";

const router =
    express.Router();

router.use(
    authenticate,
    authorize(
        ROLES.ADMIN
    )
);

router.post(
    "/create-manager",
    createManager
);

router.get(
    "/get-managers",
    getManagers
);

router.get(
    "/get-manager-by-id/:id",
    getManagerById
);

router.put(
    "/update-manager/:id",
    updateManager
);

router.delete(
    "/delete-manager/:id",
    deleteManager
);

export default router;