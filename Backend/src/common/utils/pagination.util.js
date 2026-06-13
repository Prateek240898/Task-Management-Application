export const getPagination = (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;
    const search = query.search?.trim() || "";
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        search
    };
};