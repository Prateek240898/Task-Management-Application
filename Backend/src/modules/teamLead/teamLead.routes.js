import express from "express";
import {
    assignEmployee,
    unassignEmployee,
    getEmployees
} from "./teamLead.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { authorize } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/constants/roles.constant.js";

const router =
    express.Router();

router.use(
    authenticate,
    authorize(
        ROLES.TEAM_LEAD
    )
);

router.get(
    "/get-employees",
    getEmployees
);

router.patch(
    "/assign-employee/:id",
    assignEmployee
);

router.patch(
    "/unassign-employee/:id",
    unassignEmployee
);

export default router;