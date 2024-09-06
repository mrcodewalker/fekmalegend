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
  saveUserName(userName: string): void{
    sessionStorage.setItem('userName', userName);
  }
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }
  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }
  getUserName(): string | null {
    return sessionStorage.getItem('userName');
  }
  clearToken(): void {
    sessionStorage.removeItem('authToken');
  }
  clearUserId(): void{
    sessionStorage.removeItem('userId');
  }
  clearUserName(): void{
    sessionStorage.removeItem('userName');
  }
}
