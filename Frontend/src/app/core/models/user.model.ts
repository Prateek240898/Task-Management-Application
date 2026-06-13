export interface User {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    role: string;
    managerId?: string | null;
    teamLeadId?: string | null;
    isActive: boolean;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
}