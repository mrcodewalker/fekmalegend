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
  private apiVirtualCalendar = `${environment.apiBaseUrl}/login/login/virtual_calendar`;
  private apiICSExport = `${environment.apiBaseUrl}/calendar/export`;
  constructor(private http: HttpClient) {
  }
  login(loginDTO: LoginDto): Observable<any>{
    return this.http.post<any>(this.apiLogin, loginDTO);
  }
  export(schedule: any): Observable<any> {
    return this.http.post<any>(this.apiICSExport, schedule, { responseType: 'blob' as 'json' });
  }
  getVirtualCalendar(loginDTO: LoginDto): Observable<any>{
    return this.http.post<any>(this.apiVirtualCalendar, loginDTO);
  }
}
