import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole();

    if (role?.toLowerCase() === 'teacher') {
      return true;
    } else {
      this.router.navigate(['/login/forum']);
      return false;
    }
  }
}
