import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";
import {LoginDto} from "../dtos/login.dto";
import {SignupDto} from "../dtos/signup.dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiSignUp = `${environment.apiBaseUrl}/users/register`;
  private apiCheckUserName = `${environment.apiBaseUrl}/users/find/`;
  private apiOauth2Google = `${environment.apiBaseUrl}/oauth2/authorization/google`;
  private apiLogOutGoogle = `${environment.apiBaseUrl}/logout`;
  private apiLogOutGoogle2 = `${environment.apiBaseUrl}/login?logout`;
  private apiViewProfile = `${environment.apiBaseUrl}/users/profile`;
  private apiUpdateAvatar = `${environment.apiBaseUrl}/users/query`;


  constructor(private http: HttpClient) {
  }

  login(loginDTO: LoginDto): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  updateAvatar(id: any, avatar: any): Observable<any>{
    const params = new HttpParams().set('avatar', avatar);
    return this.http.get(this.apiUpdateAvatar+`/${id}`, {params});
  }
  viewProfile(id: any): Observable<any>{
    return this.http.get(this.apiViewProfile+`/${id}`);
  }
  logoutOauth2Google(): Observable<any> {
    return this.http.get(this.apiLogOutGoogle);
  }
  logoutOauth2Google2(): Observable<any> {
    return this.http.get(this.apiLogOutGoogle2);
  }
  signUp(signupDTO: SignupDto): Observable<any> {
    return this.http.post(this.apiSignUp, signupDTO, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  checkUserName(username: string): Observable<any>{
    return this.http.get(this.apiCheckUserName+`${username}`)
  }
}
