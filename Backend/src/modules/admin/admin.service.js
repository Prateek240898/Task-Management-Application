import bcrypt from "bcrypt";
import User from "../users/user.model.js";
import { ROLES } from "../../common/constants/roles.constant.js";
import { ApiError } from "../../common/errors/api.error.js";
import { getPagination } from "../../common/utils/pagination.util.js";

class ManagerService {

    async createManager(payload, adminId) {
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

        const manager =
            await User.create({
                fullName,
                username,
                email,
                password,
                role: ROLES.MANAGER,
                createdBy: adminId
            });

        return manager;
    }

    async updateManager(
        managerId,
        payload
    ) {

        const manager =
            await User.findOne({
                _id: managerId,
                role: ROLES.MANAGER,
                isActive: true
            });

        if (!manager) {
            throw new ApiError(
                "Manager not found",
                404
            );
        }

        if (payload.email) {

            const existingEmail =
                await User.findOne({
                    email: payload.email,
                    _id: {
                        $ne: managerId
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
                        $ne: managerId
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
            managerId,
            payload,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteManager(
        managerId
    ) {

        const manager =
            await User.findOneAndUpdate(
                {
                    _id: managerId,
                    role: ROLES.MANAGER,
                    isActive: true
                },
                {
                    isActive: false
                },
                {
                    new: true
                }
            );

        if (!manager) {
            throw new ApiError(
                "Manager not found",
                404
            );
        }

        return manager;
    }

    async getManagerById(
        managerId
    ) {

        const manager =
            await User.findOne({
                _id: managerId,
                role: ROLES.MANAGER,
                isActive: true
            });

        if (!manager) {
            throw new ApiError(
                "Manager not found",
                404
            );
        }

        return manager;
    }

    async getManagers(
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
            role: ROLES.MANAGER,
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

        const managers =
            await User.find(filter)
                .sort({
                    [finalSortField]:
                        sortOrder
                })
                .skip(skip)
                .limit(limit);

        return {
            managers,
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

export default new ManagerService();