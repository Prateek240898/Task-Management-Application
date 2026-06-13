import { Pagination } from "./pagination.model";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: Pagination;
}
