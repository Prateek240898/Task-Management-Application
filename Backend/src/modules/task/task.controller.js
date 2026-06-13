import TaskService from "./task.service.js";
import { ApiResponse } from "../../common/utils/api-response.util.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

export const createTask =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const task =
                await TaskService.createTask(
                    req.body,
                    req.user
                );

            return ApiResponse.returnSuccess(
                res,
                task,
                "Task created successfully",
                201
            );
        }
    );

export const getTaskById =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const task =
                await TaskService.getTaskById(
                    req.params.id,
                    req.user
                );

            return ApiResponse.returnSuccess(
                res,
                task,
                "Task fetched successfully"
            );
        }
    );

export const getTasksList =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const result =
                await TaskService.getTasks(
                    req.user,
                    req.query
                );

            return ApiResponse.returnSuccess(
                res,
                result.tasks,
                "Tasks fetched successfully",
                200,
                result.pagination
            );
        }
    );

export const updateTask =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const task =
                await TaskService.updateTask(
                    req.params.id,
                    req.body,
                    req.user
                );

            return ApiResponse.returnSuccess(
                res,
                task,
                "Task updated successfully"
            );
        }
    );

export const changeTaskStatus =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const task =
                await TaskService.changeTaskStatus(
                    req.params.id,
                    req.body.status,
                    req.user
                );

            return ApiResponse.returnSuccess(
                res,
                task,
                "Task status updated successfully"
            );
        }
    );

export const deleteTask =
    asyncHandler(
        async (
            req,
            res
        ) => {

            await TaskService.deleteTask(
                req.params.id,
                req.user
            );

            return ApiResponse.returnSuccess(
                res,
                null,
                "Task deleted successfully"
            );
        }
    );

export const getAssignableUsers =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const users =
                await TaskService.getAssignableUsers(
                    req.user
                );

            return ApiResponse.returnSuccess(
                res,
                users,
                "Assignable users fetched successfully"
            );
        }
    );