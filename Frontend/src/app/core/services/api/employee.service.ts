import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly apiUrl =
    `${environment.api_url}/team-lead`;

  constructor(
    private http: HttpClient
  ) { }

  getEmployees(
    params: any
  ): Observable<ApiResponse<User[]>> {

    return this.http.get<
      ApiResponse<User[]>
    >(
      `${this.apiUrl}/get-employees`,
      {
        params
      }
    );
  }

  assignEmployee(
    employeeId: string
  ): Observable<ApiResponse<User>> {

    return this.http.patch<
      ApiResponse<User>
    >(
      `${this.apiUrl}/assign-employee/${employeeId}`,
      {}
    );
  }

  unassignEmployee(
    employeeId: string
  ): Observable<ApiResponse<User>> {

    return this.http.patch<
      ApiResponse<User>
    >(
      `${this.apiUrl}/unassign-employee/${employeeId}`,
      {}
    );
  }
}