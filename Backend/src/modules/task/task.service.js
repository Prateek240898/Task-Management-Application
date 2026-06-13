import Task from "./task.model.js";
import User from "../users/user.model.js";
import { ROLES } from "../../common/constants/roles.constant.js";
import { ApiError } from "../../common/errors/api.error.js";
import { getPagination } from "../../common/utils/pagination.util.js";

class TaskService {

    async validateAssignment(
        loggedInUser,
        assignedTo
    ) {

        const assignee =
            await User.findOne({
                _id: assignedTo,
                isActive: true
            });

        if (!assignee) {

            throw new ApiError(
                "Assigned user not found",
                404
            );
        }

        switch (
        loggedInUser.role
        ) {

            case ROLES.EMPLOYEE:

                if (
                    assignedTo.toString() !==
                    loggedInUser._id.toString()
                ) {

                    throw new ApiError(
                        "Employees can assign task only to themselves",
                        403
                    );
                }

                break;

            case ROLES.TEAM_LEAD:

                if (
                    assignedTo.toString() ===
                    loggedInUser._id.toString()
                ) {
                    return assignee;
                }

                const employee =
                    await User.findOne({
                        _id: assignedTo,
                        role: ROLES.EMPLOYEE,
                        teamLeadId:
                            loggedInUser._id,
                        isActive: true
                    });

                if (!employee) {

                    throw new ApiError(
                        "You can assign task only to your team members",
                        403
                    );
                }

                break;

            case ROLES.MANAGER:

                if (
                    assignedTo.toString() ===
                    loggedInUser._id.toString()
                ) {
                    return assignee;
                }

                const teamLead =
                    await User.findOne({
                        _id: assignedTo,
                        role: ROLES.TEAM_LEAD,
                        managerId:
                            loggedInUser._id,
                        isActive: true
                    });

                if (teamLead) {
                    return assignee;
                }

                const teamEmployee =
                    await User.findOne({
                        _id: assignedTo,
                        role: ROLES.EMPLOYEE,
                        managerId:
                            loggedInUser._id,
                        isActive: true
                    });

                if (!teamEmployee) {

                    throw new ApiError(
                        "You can assign task only to your hierarchy users",
                        403
                    );
                }

                break;
        }

        return assignee;
    }

    async buildTaskAccessFilter(
        loggedInUser
    ) {

        let userIds = [];

        switch (
        loggedInUser.role
        ) {

            case ROLES.EMPLOYEE:

                userIds = [
                    loggedInUser._id
                ];

                break;

            case ROLES.TEAM_LEAD:

                const employees =
                    await User.find({
                        teamLeadId:
                            loggedInUser._id,
                        role:
                            ROLES.EMPLOYEE,
                        isActive: true
                    }).select("_id");

                userIds = [
                    loggedInUser._id,
                    ...employees.map(
                        employee =>
                            employee._id
                    )
                ];

                break;

            case ROLES.MANAGER:

                const hierarchyUsers =
                    await User.find({
                        managerId:
                            loggedInUser._id,
                        isActive: true
                    }).select("_id");

                userIds = [
                    loggedInUser._id,
                    ...hierarchyUsers.map(
                        user =>
                            user._id
                    )
                ];

                break;
        }

        return {
            assignedTo: {
                $in: userIds
            }
        };
    }

    async createTask(
        payload,
        loggedInUser
    ) {

        let assignedTo =
            payload.assignedTo;

        if (
            loggedInUser.role ===
            ROLES.EMPLOYEE
        ) {

            assignedTo =
                loggedInUser._id;
        }

        await this.validateAssignment(
            loggedInUser,
            assignedTo
        );

        return await Task.create({
            title:
                payload.title,

            description:
                payload.description,

            assignedTo,

            createdBy:
                loggedInUser._id
        });
    }

    async getTaskById(
        taskId,
        loggedInUser
    ) {

        const accessFilter =
            await this.buildTaskAccessFilter(
                loggedInUser
            );

        const task =
            await Task.findOne({
                _id: taskId,
                isDeleted: false,
                ...accessFilter
            })
                .populate(
                    "createdBy",
                    "fullName username email role"
                )
                .populate(
                    "assignedTo",
                    "fullName username email role"
                );

        if (!task) {

            throw new ApiError(
                "Task not found",
                404
            );
        }

        return task;
    }

    async getTasks(
        loggedInUser,
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

        const accessFilter =
            await this.buildTaskAccessFilter(
                loggedInUser
            );

        const filter = {
            isDeleted: false,
            ...accessFilter
        };

        if (
            queryParams.status
        ) {

            filter.status =
                queryParams.status;
        }

        if (search) {

            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const allowedSortFields = [
            "title",
            "status",
            "createdAt",
            "updatedAt"
        ];

        const finalSortField =
            allowedSortFields.includes(
                sortBy
            )
                ? sortBy
                : "createdAt";

        const totalRecords =
            await Task.countDocuments(
                filter
            );

        const tasks =
            await Task.find(filter)
                .populate(
                    "createdBy",
                    "fullName username role"
                )
                .populate(
                    "assignedTo",
                    "fullName username role"
                )
                .sort({
                    [finalSortField]:
                        sortOrder
                })
                .skip(skip)
                .limit(limit);

        return {
            tasks,
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

    async updateTask(
        taskId,
        payload,
        loggedInUser
    ) {

        const accessFilter =
            await this.buildTaskAccessFilter(
                loggedInUser
            );

        const task =
            await Task.findOne({
                _id: taskId,
                isDeleted: false,
                ...accessFilter
            });

        if (!task) {

            throw new ApiError(
                "Task not found",
                404
            );
        }

        if (
            payload.assignedTo
        ) {

            await this.validateAssignment(
                loggedInUser,
                payload.assignedTo
            );

            task.assignedTo =
                payload.assignedTo;
        }

        if (
            payload.title !==
            undefined
        ) {

            task.title =
                payload.title;
        }

        if (
            payload.description !==
            undefined
        ) {

            task.description =
                payload.description;
        }

        if (
            payload.status !==
            undefined
        ) {

            task.status =
                payload.status;
        }

        await task.save();

        return task;
    }

    async changeTaskStatus(
        taskId,
        status,
        loggedInUser
    ) {

        const accessFilter =
            await this.buildTaskAccessFilter(
                loggedInUser
            );

        const task =
            await Task.findOne({
                _id: taskId,
                isDeleted: false,
                ...accessFilter
            });

        if (!task) {

            throw new ApiError(
                "Task not found",
                404
            );
        }

        task.status = status;

        await task.save();

        return task;
    }

    async deleteTask(
        taskId,
        loggedInUser
    ) {

        const accessFilter =
            await this.buildTaskAccessFilter(
                loggedInUser
            );

        const task =
            await Task.findOne({
                _id: taskId,
                isDeleted: false,
                ...accessFilter
            });

        if (!task) {

            throw new ApiError(
                "Task not found",
                404
            );
        }

        task.isDeleted = true;
        task.deletedAt = new Date();
        task.deletedBy =
            loggedInUser._id;

        await task.save();

        return true;
    }

    async getAssignableUsers(
        loggedInUser
    ) {

        switch (
        loggedInUser.role
        ) {

            case ROLES.EMPLOYEE:

                return [
                    {
                        _id:
                            loggedInUser._id,
                        fullName:
                            loggedInUser.fullName,
                        username: loggedInUser.username,
                        role:
                            loggedInUser.role
                    }
                ];

            case ROLES.TEAM_LEAD:

                const employees =
                    await User.find({
                        role:
                            ROLES.EMPLOYEE,
                        teamLeadId:
                            loggedInUser._id,
                        isActive: true
                    })
                        .select(
                            "_id fullName username role"
                        )
                        .sort({
                            fullName: 1
                        });

                return [
                    {
                        _id:
                            loggedInUser._id,
                        fullName:
                            loggedInUser.fullName,
                        username: loggedInUser.username,
                        role:
                            loggedInUser.role
                    },
                    ...employees
                ];

            case ROLES.MANAGER:

                const hierarchyUsers =
                    await User.find({
                        managerId:
                            loggedInUser._id,
                        isActive: true
                    })
                        .select(
                            "_id fullName username role"
                        )
                        .sort({
                            fullName: 1
                        });

                return [
                    {
                        _id:
                            loggedInUser._id,
                        fullName:
                            loggedInUser.fullName,
                        username: loggedInUser.username,
                        role:
                            loggedInUser.role
                    },
                    ...hierarchyUsers
                ];

            default:

                return [];
        }
    }
}

export default new TaskService();