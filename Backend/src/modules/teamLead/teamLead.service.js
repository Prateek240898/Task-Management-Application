import User from "../users/user.model.js";
import { ROLES } from "../../common/constants/roles.constant.js";
import { ApiError } from "../../common/errors/api.error.js";
import { getPagination } from "../../common/utils/pagination.util.js";

class EmployeeService {

    async assignEmployee(
        employeeId,
        teamLead
    ) {

        const employee =
            await User.findOne({
                _id: employeeId,
                role: ROLES.EMPLOYEE,
                isActive: true
            });

        if (!employee) {
            throw new ApiError(
                "Employee not found",
                404
            );
        }

        employee.teamLeadId =
            teamLead._id;

        employee.managerId =
            teamLead.managerId;

        await employee.save();

        return employee;
    }

    async unassignEmployee(
        employeeId
    ) {

        const employee =
            await User.findOne({
                _id: employeeId,
                role: ROLES.EMPLOYEE,
                isActive: true
            });

        if (!employee) {
            throw new ApiError(
                "Employee not found",
                404
            );
        }

        employee.teamLeadId =
            null;

        employee.managerId =
            null;

        await employee.save();

        return employee;
    }

    async getEmployees(
    teamLead,
    queryParams
) {

    const {
        page,
        limit,
        skip,
        search,
        sortBy,
        sortOrder
    } = getPagination(
        queryParams
    );

    const filter = {
        role: ROLES.EMPLOYEE,
        isActive: true
    };

    let visibilityFilter = {};

    switch (
    queryParams.filter
    ) {

        case "assigned":

            visibilityFilter = {
                teamLeadId:
                    teamLead._id
            };

            break;

        case "unassigned":

            visibilityFilter = {
                teamLeadId: null
            };

            break;

        default:

            visibilityFilter = {
                $or: [
                    {
                        teamLeadId:
                            teamLead._id
                    },
                    {
                        teamLeadId: null
                    }
                ]
            };

            break;
    }

    if (search) {

        filter.$and = [
            visibilityFilter,
            {
                $or: [
                    {
                        fullName: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        username: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        email: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            }
        ];
    }
    else {

        Object.assign(
            filter,
            visibilityFilter
        );
    }

    const allowedSortFields = [
        "fullName",
        "username",
        "email",
        "createdAt"
    ];

    const finalSortField =
        allowedSortFields.includes(
            sortBy
        )
            ? sortBy
            : "createdAt";

    const totalRecords =
        await User.countDocuments(
            filter
        );

    const employees =
        await User.find(filter)
            .sort({
                [finalSortField]:
                    sortOrder
            })
            .skip(skip)
            .limit(limit);

    return {
        employees,
        pagination: {
            page,
            limit,
            totalRecords,
            totalPages:
                Math.ceil(
                    totalRecords /
                    limit
                )
        }
    };
}
}

export default new EmployeeService();