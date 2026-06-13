import express from "express";
import {
    createTeamLead,
    updateTeamLead,
    deleteTeamLead,
    getTeamLeadById,
    getTeamLeads
} from "./manager.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { authorize } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/constants/roles.constant.js";

const router =
    express.Router();

router.use(
    authenticate,
    authorize(
        ROLES.MANAGER
    )
);

router.post(
    "/create-team-lead",
    createTeamLead
);

router.get(
    "/get-team-leads",
    getTeamLeads
);

router.get(
    "/get-team-lead/:id",
    getTeamLeadById
);

router.put(
    "/update-team-lead/:id",
    updateTeamLead
);

router.delete(
    "/delete-team-lead/:id",
    deleteTeamLead
);

export default router;