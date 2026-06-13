import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private readonly apiUrl =
    `${environment.api_url}/admin`;

  constructor(
    private http: HttpClient
  ) { }

  createManager(
    payload: any
  ): Observable<ApiResponse<User>> {

    return this.http.post<
      ApiResponse<User>
    >(
      `${this.apiUrl}/create-manager`,
      payload
    );
  }

  updateManager(
    managerId: string,
    payload: any
  ): Observable<ApiResponse<User>> {

    return this.http.put<
      ApiResponse<User>
    >(
      `${this.apiUrl}/update-manager/${managerId}`,
      payload
    );
  }

  deleteManager(
    managerId: string
  ): Observable<ApiResponse<User>> {

    return this.http.delete<
      ApiResponse<User>
    >(
      `${this.apiUrl}/delete-manager/${managerId}`
    );
  }

  getManagerById(
    managerId: string
  ): Observable<ApiResponse<User>> {

    return this.http.get<
      ApiResponse<User>
    >(
      `${this.apiUrl}/get-manager-by-id/${managerId}`
    );
  }

  getManagers(
    params: any
  ): Observable<ApiResponse<User[]>> {

    return this.http.get<
      ApiResponse<User[]>
    >(
      `${this.apiUrl}/get-managers`,
      {
        params
      }
    );
  }
}
