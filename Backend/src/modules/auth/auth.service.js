import User from "../users/user.model.js";
import { generateToken } from "../../common/utils/jwt.util.js";
import { ApiError } from "../../common/errors/api.error.js";

class AuthService {
    async register(payload) {
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

        const user =
            await User.create({
                fullName,
                username,
                email,
                password
            });

        return user;
    }

    async login(
        loginId,
        password
    ) {

        const user =
            await User.findOne({
                $or: [
                    {
                        email: loginId
                    },
                    {
                        username: loginId
                    }
                ]
            }).select("+password");

        if (!user) {
            throw new ApiError(
                "Invalid credentials",
                401
            );
        }

        const isPasswordMatched =
            await user.comparePassword(
                password
            );

        if (!isPasswordMatched) {
            throw new ApiError(
                "Invalid credentials",
                401
            );
        }

        if (!user.isActive) {
            throw new ApiError(
                "Your account is inactive",
                403
            );
        }

        const token =
            generateToken({
                id: user._id,
                role: user.role
            });

        return {
            token,
            user
        };
    }

    async getCurrentUser(
        userId
    ) {

        return await User.findById(
            userId
        );
    }
}

export default new AuthService();