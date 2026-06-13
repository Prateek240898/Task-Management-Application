import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStateService } from '../services/user-state/user-state.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userStateService = inject(UserStateService);

  if (userStateService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
