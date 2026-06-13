import EmployeeService from "./teamLead.service.js";
import { ApiResponse } from "../../common/utils/api-response.util.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

export const assignEmployee =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const employee =
                await EmployeeService.assignEmployee(
                    req.params.id,
                    req.user
                );

            return ApiResponse.returnSuccess(
                res,
                employee,
                "Employee assigned successfully"
            );
        }
    );

export const unassignEmployee =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const employee =
                await EmployeeService.unassignEmployee(
                    req.params.id
                );

            return ApiResponse.returnSuccess(
                res,
                employee,
                "Employee unassigned successfully"
            );
        }
    );

export const getEmployees =
    asyncHandler(
        async (
            req,
            res
        ) => {

            const result =
                await EmployeeService.getEmployees(
                    req.user,
                    req.query
                );

            return ApiResponse.returnSuccess(
                res,
                result.employees,
                "Employees fetched successfully",
                200,
                result.pagination
            );
        }
    );