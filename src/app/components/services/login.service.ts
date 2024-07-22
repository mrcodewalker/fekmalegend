import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";
import {LoginDto} from "../dtos/login.dto";

@Injectable({
  providedIn: 'root'
})
export class LoginService{
  private apiLogin = `${environment.apiBaseUrl}/login/login`;
  constructor(private http: HttpClient) {
  }
  login(loginDTO: LoginDto): Observable<any>{
    return this.http.post<any>(this.apiLogin, loginDTO);
  }
}
