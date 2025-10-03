import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: Usuario | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.rol === 'admin';
  }

  isUser(): boolean {
    return this.currentUser?.rol === 'user';
  }
}