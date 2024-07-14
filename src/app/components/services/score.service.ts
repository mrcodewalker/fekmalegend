import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScoreService{
  private apiGetScoresByStudentCode = `${environment.apiBaseUrl}/scores/users/`;
  constructor(private http: HttpClient) {
  }
  getScoresByStudentCode(student_code: string): Observable<any>{
    return this.http.get<any>(this.apiGetScoresByStudentCode+student_code, {withCredentials: true});
  }
}
