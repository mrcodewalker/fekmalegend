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
  private apiLogin = `${environment.apiLocalUrl}/users/login`;
  private apiSignUp = `${environment.apiLocalUrl}/users/register`;
  private apiCheckUserName = `${environment.apiLocalUrl}/users/find/`;
  private apiOauth2Google = `${environment.apiLocalUrl}/oauth2/authorization/google`;
  private apiLogOutGoogle = `${environment.apiLocalUrl}/logout`;
  private apiLogOutGoogle2 = `${environment.apiLocalUrl}/login?logout`;


  constructor(private http: HttpClient) {
  }

  login(loginDTO: LoginDto): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, {
      headers: { 'Content-Type': 'application/json' }
    });
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
