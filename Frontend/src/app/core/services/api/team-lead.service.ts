import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TeamLeadService {

  private readonly apiUrl =
    `${environment.api_url}/manager`;

  constructor(
    private http: HttpClient
  ) { }

  createTeamLead(
    payload: any
  ): Observable<ApiResponse<User>> {

    return this.http.post<
      ApiResponse<User>
    >(
      `${this.apiUrl}/create-team-lead`,
      payload
    );
  }

  updateTeamLead(
    teamLeadId: string,
    payload: any
  ): Observable<ApiResponse<User>> {

    return this.http.put<
      ApiResponse<User>
    >(
      `${this.apiUrl}/update-team-lead/${teamLeadId}`,
      payload
    );
  }

  deleteTeamLead(
    teamLeadId: string
  ): Observable<ApiResponse<User>> {

    return this.http.delete<
      ApiResponse<User>
    >(
      `${this.apiUrl}/delete-team-lead/${teamLeadId}`
    );
  }

  getTeamLeadById(
    teamLeadId: string
  ): Observable<ApiResponse<User>> {

    return this.http.get<
      ApiResponse<User>
    >(
      `${this.apiUrl}/get-team-lead/${teamLeadId}`
    );
  }

  getTeamLeads(
    params: any
  ): Observable<ApiResponse<User[]>> {

    return this.http.get<
      ApiResponse<User[]>
    >(
      `${this.apiUrl}/get-team-leads`,
      {
        params
      }
    );
  }
}