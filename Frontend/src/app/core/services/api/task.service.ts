import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../../environments/environment';

import {
  ApiResponse
} from '../../models/api-response.model';

import {
  Task
} from '../../models/task.model';

import {
  AssignableUser
} from '../../models/assignable-user.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly apiUrl =
    `${environment.api_url}/task`;

  constructor(
    private http: HttpClient
  ) { }

  createTask(
    payload: any
  ): Observable<ApiResponse<Task>> {

    return this.http.post<
      ApiResponse<Task>
    >(
      `${this.apiUrl}/create-task`,
      payload
    );
  }

  updateTask(
    taskId: string,
    payload: any
  ): Observable<ApiResponse<Task>> {

    return this.http.put<
      ApiResponse<Task>
    >(
      `${this.apiUrl}/update-task/${taskId}`,
      payload
    );
  }

  deleteTask(
    taskId: string
  ): Observable<ApiResponse<null>> {

    return this.http.delete<
      ApiResponse<null>
    >(
      `${this.apiUrl}/delete-task/${taskId}`
    );
  }

  getTaskById(
    taskId: string
  ): Observable<ApiResponse<Task>> {

    return this.http.get<
      ApiResponse<Task>
    >(
      `${this.apiUrl}/get-task/${taskId}`
    );
  }

  getTasks(
    params: any
  ): Observable<ApiResponse<Task[]>> {

    return this.http.get<
      ApiResponse<Task[]>
    >(
      `${this.apiUrl}/get-tasks-list`,
      {
        params
      }
    );
  }

  changeTaskStatus(
    taskId: string,
    status: string
  ): Observable<ApiResponse<Task>> {

    return this.http.patch<
      ApiResponse<Task>
    >(
      `${this.apiUrl}/change-task-status/${taskId}`,
      {
        status
      }
    );
  }

  getAssignableUsers():
    Observable<
      ApiResponse<
        AssignableUser[]
      >
    > {

    return this.http.get<
      ApiResponse<
        AssignableUser[]
      >
    >(
      `${this.apiUrl}/get-assignable-users`
    );
  }
}