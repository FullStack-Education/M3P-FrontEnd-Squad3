import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppSidebarComponent } from './core/components/sidebar/sidebar.component';
import { AppHeaderToolbarComponent } from './core/components/header-toolbar/header-toolbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AppSidebarComponent,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AppHeaderToolbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'labPCP - Gestão Educational';
  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
