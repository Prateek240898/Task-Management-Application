export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
};