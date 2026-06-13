import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { AuthService } from '../api/auth.service';
import { UserStateService } from '../user-state/user-state.service';


@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private authService: AuthService,
    private userStateService: UserStateService
  ) { }

  async initializeApp(): Promise<void> {

    try {

      const response =
        await firstValueFrom(
          this.authService.getCurrentUser()
        );

      if (
        response?.success &&
        response?.data
      ) {

        this.userStateService.setUser(
          response.data
        );
      }

    } catch {

      /*
       User not logged in
       Ignore silently
      */

      this.userStateService.clearUser();
    }
  }
}