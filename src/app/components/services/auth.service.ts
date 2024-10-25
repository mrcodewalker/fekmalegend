import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {GraphRequestDto} from "../dtos/graph.request.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();
  constructor() {
    const savedRole = sessionStorage.getItem('role');
    this.roleSubject.next(savedRole);
  }
  saveRole(role: string): void{
    sessionStorage.setItem('role', role);
    this.roleSubject.next(role); // Cập nhật giá trị role trong BehaviorSubject
  }
  saveGraph(graph: GraphRequestDto): void{
    sessionStorage.setItem('subject_name', graph.subject_name);
    sessionStorage.setItem('year_course', graph.year_course);
  }
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
  getRole(): string | null {
    return sessionStorage.getItem('role');
  }
  getSubjectName(): string | null{
    return sessionStorage.getItem('subject_name');
  }
  getYearCourse(): string | null {
    return sessionStorage.getItem('year_course');
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
  clearGraph(): void{
    sessionStorage.removeItem('subject_name');
    sessionStorage.removeItem('year_course');
  }
  clearRole(): void {
    sessionStorage.removeItem('role');
    this.roleSubject.next(null); // Reset role trong BehaviorSubject
  }
  clearUserId(): void{
    sessionStorage.removeItem('userId');
  }
  clearUserName(): void{
    sessionStorage.removeItem('userName');
  }
}
