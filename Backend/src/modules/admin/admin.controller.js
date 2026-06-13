import ManagerService from "./admin.service.js";
import { ApiResponse } from "../../common/utils/api-response.util.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

export const createManager =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const manager =
                await ManagerService.createManager(
                    req.body,
                    req.user._id
                );

            return ApiResponse.returnSuccess(
                res,
                manager,
                "Manager created successfully",
                201
            );
        }
    );

export const updateManager =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const manager =
                await ManagerService.updateManager(
                    req.params.id,
                    req.body
                );

            return ApiResponse.returnSuccess(
                res,
                manager,
                "Manager updated successfully"
            );
        }
    );

export const deleteManager =
    asyncHandler(
        async (
            req,
            res
        ) => {

            await ManagerService.deleteManager(
                req.params.id
            );

            return ApiResponse.returnSuccess(
                res,
                null,
                "Manager deleted successfully"
            );
        }
    );

export const getManagerById =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const manager =
                await ManagerService.getManagerById(
                    req.params.id
                );

            return ApiResponse.returnSuccess(
                res,
                manager,
                "Manager fetched successfully"
            );
        }
    );

export const getManagers =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const result =
                await ManagerService.getManagers(
                    req.query
                );

            return ApiResponse.returnSuccess(
                res,
                result.managers,
                "Managers fetched successfully",
                200,
                result.pagination
            );
        }
    );