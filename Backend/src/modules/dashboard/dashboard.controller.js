import DashboardService from "./dashboard.service.js";
import { ApiResponse } from "../../common/utils/api-response.util.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

export const getDashboard =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const dashboard =
                await DashboardService.getDashboard(
                    req.user
                );

            return ApiResponse.returnSuccess(
                res,
                dashboard,
                "Dashboard fetched successfully"
            );
        }
    );