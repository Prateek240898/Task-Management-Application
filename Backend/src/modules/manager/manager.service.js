import bcrypt from "bcrypt";
import User from "../users/user.model.js";
import { ROLES } from "../../common/constants/roles.constant.js";
import { ApiError } from "../../common/errors/api.error.js";
import { getPagination } from "../../common/utils/pagination.util.js";

class TeamLeadService {

    async createTeamLead(payload, managerId) {
        const {
            fullName,
            username,
            email,
            password
        } = payload;

        const existingEmail =
            await User.findOne({
                email
            });

        if (existingEmail) {
            throw new ApiError(
                "Email already exists",
                409
            );
        }

        const existingUsername =
            await User.findOne({
                username
            });

        if (existingUsername) {
            throw new ApiError(
                "Username already exists",
                409
            );
        }

        return await User.create({
            fullName,
            username,
            email,
            password,
            role: ROLES.TEAM_LEAD,
            managerId,
            createdBy: managerId
        });
    }

    async updateTeamLead(
        teamLeadId,
        managerId,
        payload
    ) {

        const teamLead =
            await User.findOne({
                _id: teamLeadId,
                role: ROLES.TEAM_LEAD,
                managerId,
                isActive: true
            });

        if (!teamLead) {
            throw new ApiError(
                "Team Lead not found",
                404
            );
        }

        if (payload.email) {

            const existingEmail =
                await User.findOne({
                    email:
                        payload.email,
                    _id: {
                        $ne:
                            teamLeadId
                    }
                });

            if (existingEmail) {
                throw new ApiError(
                    "Email already exists",
                    409
                );
            }
        }

        if (payload.username) {

            const existingUsername =
                await User.findOne({
                    username:
                        payload.username,
                    _id: {
                        $ne:
                            teamLeadId
                    }
                });

            if (existingUsername) {
                throw new ApiError(
                    "Username already exists",
                    409
                );
            }
        }

        if (payload.password) {

            payload.password =
                await bcrypt.hash(
                    payload.password,
                    10
                );
        }

        return await User.findByIdAndUpdate(
            teamLeadId,
            payload,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteTeamLead(
        teamLeadId,
        managerId
    ) {

        const teamLead =
            await User.findOneAndUpdate(
                {
                    _id: teamLeadId,
                    role: ROLES.TEAM_LEAD,
                    managerId,
                    isActive: true
                },
                {
                    isActive: false
                },
                {
                    new: true
                }
            );

        if (!teamLead) {
            throw new ApiError(
                "Team Lead not found",
                404
            );
        }

        return teamLead;
    }

    async getTeamLeadById(
        teamLeadId,
        managerId
    ) {

        const teamLead =
            await User.findOne({
                _id: teamLeadId,
                role: ROLES.TEAM_LEAD,
                managerId,
                isActive: true
            });

        if (!teamLead) {
            throw new ApiError(
                "Team Lead not found",
                404
            );
        }

        return teamLead;
    }

    async getTeamLeads(
        managerId,
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
            role: ROLES.TEAM_LEAD,
            managerId,
            isActive: true
        };

        if (search) {

            filter.$or = [
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
            ];
        }

        if (
            queryParams.status !==
            undefined
        ) {

            filter.isActive =
                queryParams.status ===
                "true";
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

        const teamLeads =
            await User.find(filter)
                .sort({
                    [finalSortField]:
                        sortOrder
                })
                .skip(skip)
                .limit(limit);

        return {
            teamLeads,
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

export default new TeamLeadService();