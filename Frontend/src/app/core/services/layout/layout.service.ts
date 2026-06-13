import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  isSidebarCollapsed =
    signal(false);

  isMobileSidebarOpen =
    signal(false);

  toggleSidebar(): void {

    if (
      window.innerWidth <= 768
    ) {

      this.isMobileSidebarOpen.update(
        value => !value
      );

      return;
    }

    this.isSidebarCollapsed.update(
      value => !value
    );
  }

  closeMobileSidebar(): void {

    this.isMobileSidebarOpen.set(
      false
    );
  }
}
