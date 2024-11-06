import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppSidebarComponent } from './core/components/sidebar/sidebar.component';
import { AppHeaderToolbarComponent } from './core/components/header-toolbar/header-toolbar.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './core/components/spinner/spinner.component';
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
    SpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'labPCP - Gestão Educational';
  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url ==='/unauthenticated';
  }
}
