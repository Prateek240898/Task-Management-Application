import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '../services/user-state/user-state.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const userStateService = inject(UserStateService);

  const expectedRoles = route.data['roles'];
  const currentRole = userStateService.role();

  if (expectedRoles.includes(currentRole)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
