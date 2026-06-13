import TeamLeadService from "./manager.service.js";
import { ApiResponse } from "../../common/utils/api-response.util.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

export const createTeamLead =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const teamLead =
                await TeamLeadService.createTeamLead(
                    req.body,
                    req.user._id
                );

            return ApiResponse.returnSuccess(
                res,
                teamLead,
                "Team Lead created successfully",
                201
            );
        }
    );

export const updateTeamLead =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const teamLead =
                await TeamLeadService.updateTeamLead(
                    req.params.id,
                    req.user._id,
                    req.body
                );

            return ApiResponse.returnSuccess(
                res,
                teamLead,
                "Team Lead updated successfully"
            );
        }
    );

export const deleteTeamLead =
    asyncHandler(
        async (
            req,
            res
        ) => {

            await TeamLeadService.deleteTeamLead(
                req.params.id,
                req.user._id
            );

            return ApiResponse.returnSuccess(
                res,
                null,
                "Team Lead deleted successfully"
            );
        }
    );

export const getTeamLeadById =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const teamLead =
                await TeamLeadService.getTeamLeadById(
                    req.params.id,
                    req.user._id
                );

            return ApiResponse.returnSuccess(
                res,
                teamLead,
                "Team Lead fetched successfully"
            );
        }
    );

export const getTeamLeads =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const result =
                await TeamLeadService.getTeamLeads(
                    req.user._id,
                    req.query
                );

            return ApiResponse.returnSuccess(
                res,
                result.teamLeads,
                "Team Leads fetched successfully",
                200,
                result.pagination
            );
        }
    );