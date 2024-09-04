import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  saveToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }
  saveUserId(userId: string): void{
    sessionStorage.setItem('userId', userId);
  }
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }
  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }
  clearToken(): void {
    sessionStorage.removeItem('authToken');
  }
  clearUserId(): void{
    sessionStorage.removeItem('userId');
  }
}
