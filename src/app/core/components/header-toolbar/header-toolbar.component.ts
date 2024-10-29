import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IUser } from '../../interfaces/user.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, RouterLink],
  templateUrl: './header-toolbar.component.html',
  styleUrl: './header-toolbar.component.scss',
})
export class AppHeaderToolbarComponent implements OnInit {
  pageTitle = 'labPCP - Gestão Educacional';
  user: IUser | null = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }
}
