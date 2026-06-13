import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import morgan from "morgan";

import { notFoundHandler } from "./common/middlewares/not-found.middleware.js";
import { errorHandler } from "./common/middlewares/error.middleware.js";

/* import all routes here */
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import managerRoutes from "./modules/manager/manager.routes.js";
import teamLeadRoutes from "./modules/teamLead/teamLead.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import { ApiResponse } from "./common/utils/api-response.util.js";

const app = express();
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(hpp());
app.use(morgan("dev"));
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    })
);

/* using all the routes here */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/team-lead", teamLeadRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/", (req, res) => {
    return ApiResponse.returnSuccess(res, null, "Application running", 200);
});

/* using error handlers */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;