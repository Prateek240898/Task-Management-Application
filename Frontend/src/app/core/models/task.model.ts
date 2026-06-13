import { User } from "./user.model";

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdBy: string | User;
    assignedTo: string | User;
    isDeleted: boolean;
    deletedAt?: string | null;
    deletedBy?: string | User | null;
    createdAt: string;
    updatedAt: string;
}