import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  role = computed(() => this.currentUser()?.role || '');
  fullName = computed(() => this.currentUser()?.fullName || '');

  setUser(user: User): void {
    this.currentUser.set(user);
  }

  clearUser(): void {
    this.currentUser.set(null);
  }

  isAdmin(): boolean {

    return this.role() === 'Admin';
  }

  isManager(): boolean {

    return this.role() === 'Manager';
  }

  isTeamLead(): boolean {

    return this.role() === 'Team Lead';
  }

  isEmployee(): boolean {

    return this.role() === 'Employee';
  }
}
