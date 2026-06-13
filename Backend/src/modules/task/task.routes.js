import express from "express";
import {
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksList,
    changeTaskStatus,
    getAssignableUsers
} from "./task.controller.js";

import { authenticate } from "../../common/middlewares/auth.middleware.js";

const router =
    express.Router();

router.use(
    authenticate
);

router.post(
    "/create-task",
    createTask
);

router.get(
    "/get-tasks-list",
    getTasksList
);

router.get(
    "/get-assignable-users",
    getAssignableUsers
);

router.get(
    "/get-task/:id",
    getTaskById
);

router.put(
    "/update-task/:id",
    updateTask
);

router.patch(
    "/change-task-status/:id",
    changeTaskStatus
);

router.delete(
    "/delete-task/:id",
    deleteTask
);

export default router;