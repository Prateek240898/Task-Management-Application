import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ManagerListComponent } from './features/users/managers/manager-list/manager-list.component';
import { TeamLeadListComponent } from './features/users/team-leads/team-lead-list/team-lead-list.component';
import { EmployeeListComponent } from './features/users/employees/employee-list/employee-list.component';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'managers',
                component: ManagerListComponent
            },
            {
                path: 'team-leads',
                component: TeamLeadListComponent
            },
            {
                path: 'employees',
                component: EmployeeListComponent
            },
            {
                path: 'tasks',
                component: TaskListComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
