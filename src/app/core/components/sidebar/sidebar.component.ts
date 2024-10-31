import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { IUser } from '../../interfaces/user.interface';
import { IToken } from '../../interfaces/Itoken.inteface';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class AppSidebarComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  events: string[] = [];
  opened: boolean = false;
  user: IToken | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  get isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.scope === 'ADM';
  }

  get isDocente(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.scope === 'PROFESSOR';
  }

  get isAluno(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.scope === 'ALUNO';
  }
}