import User from "../users/user.model.js";
import Task from "../task/task.model.js";
import { ROLES } from "../../common/constants/roles.constant.js";
import { TASK_STATUS } from "../../common/constants/task-status.constant.js";

class DashboardService {

    async getDashboard(loggedInUser) {

        switch (loggedInUser.role) {

            case ROLES.ADMIN:
                return await this.getAdminDashboard();

            case ROLES.MANAGER:
                return await this.getManagerDashboard(
                    loggedInUser
                );

            case ROLES.TEAM_LEAD:
                return await this.getTeamLeadDashboard(
                    loggedInUser
                );

            case ROLES.EMPLOYEE:
                return await this.getEmployeeDashboard(
                    loggedInUser
                );

            default:
                return {};
        }
    }

    async getAdminDashboard() {

        const [
            totalManagers,
            totalTeamLeads,
            totalEmployees,
            totalTasks,
            pendingTasks,
            completedTasks
        ] = await Promise.all([

            User.countDocuments({
                role: ROLES.MANAGER,
                isActive: true
            }),

            User.countDocuments({
                role: ROLES.TEAM_LEAD,
                isActive: true
            }),

            User.countDocuments({
                role: ROLES.EMPLOYEE,
                isActive: true
            }),

            Task.countDocuments({
                isDeleted: false
            }),

            Task.countDocuments({
                status: TASK_STATUS.PENDING,
                isDeleted: false
            }),

            Task.countDocuments({
                status: TASK_STATUS.COMPLETED,
                isDeleted: false
            })
        ]);

        return {
            totalManagers,
            totalTeamLeads,
            totalEmployees,
            totalTasks,
            pendingTasks,
            completedTasks
        };
    }

    async getManagerDashboard(
        loggedInUser
    ) {

        const teamLeads =
            await User.find({
                role: ROLES.TEAM_LEAD,
                managerId: loggedInUser._id,
                isActive: true
            }).select("_id");

        const employees =
            await User.find({
                role: ROLES.EMPLOYEE,
                managerId: loggedInUser._id,
                isActive: true
            }).select("_id");

        const accessibleUserIds = [
            loggedInUser._id,
            ...teamLeads.map(
                x => x._id
            ),
            ...employees.map(
                x => x._id
            )
        ];

        const [
            totalTeamLeads,
            totalEmployees,
            totalTasks,
            pendingTasks,
            completedTasks
        ] = await Promise.all([

            User.countDocuments({
                role: ROLES.TEAM_LEAD,
                managerId: loggedInUser._id,
                isActive: true
            }),

            User.countDocuments({
                role: ROLES.EMPLOYEE,
                managerId: loggedInUser._id,
                isActive: true
            }),

            Task.countDocuments({
                assignedTo: {
                    $in: accessibleUserIds
                },
                isDeleted: false
            }),

            Task.countDocuments({
                assignedTo: {
                    $in: accessibleUserIds
                },
                status: TASK_STATUS.PENDING,
                isDeleted: false
            }),

            Task.countDocuments({
                assignedTo: {
                    $in: accessibleUserIds
                },
                status: TASK_STATUS.COMPLETED,
                isDeleted: false
            })
        ]);

        return {
            totalTeamLeads,
            totalEmployees,
            totalTasks,
            pendingTasks,
            completedTasks
        };
    }

    async getTeamLeadDashboard(
        loggedInUser
    ) {

        const employees =
            await User.find({
                role: ROLES.EMPLOYEE,
                teamLeadId: loggedInUser._id,
                isActive: true
            }).select("_id");

        const accessibleUserIds = [
            loggedInUser._id,
            ...employees.map(
                x => x._id
            )
        ];

        const [
            totalEmployees,
            totalTasks,
            pendingTasks,
            completedTasks
        ] = await Promise.all([

            User.countDocuments({
                role: ROLES.EMPLOYEE,
                teamLeadId: loggedInUser._id,
                isActive: true
            }),

            Task.countDocuments({
                assignedTo: {
                    $in: accessibleUserIds
                },
                isDeleted: false
            }),

            Task.countDocuments({
                assignedTo: {
                    $in: accessibleUserIds
                },
                status: TASK_STATUS.PENDING,
                isDeleted: false
            }),

            Task.countDocuments({
                assignedTo: {
                    $in: accessibleUserIds
                },
                status: TASK_STATUS.COMPLETED,
                isDeleted: false
            })
        ]);

        return {
            totalEmployees,
            totalTasks,
            pendingTasks,
            completedTasks
        };
    }

    async getEmployeeDashboard(
        loggedInUser
    ) {

        const [
            totalTasks,
            pendingTasks,
            completedTasks
        ] = await Promise.all([

            Task.countDocuments({
                assignedTo: loggedInUser._id,
                isDeleted: false
            }),

            Task.countDocuments({
                assignedTo: loggedInUser._id,
                status: TASK_STATUS.PENDING,
                isDeleted: false
            }),

            Task.countDocuments({
                assignedTo: loggedInUser._id,
                status: TASK_STATUS.COMPLETED,
                isDeleted: false
            })
        ]);

        return {
            totalTasks,
            pendingTasks,
            completedTasks
        };
    }
}

export default new DashboardService();