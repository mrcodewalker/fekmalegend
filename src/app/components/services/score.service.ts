import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScoreService{
  private apiGetScoresByStudentCode = `${environment.apiBaseUrl}/scores/users/`;
  private apiCodeWalker = `${environment.apiCodeWalker}/scores/users/`;
  constructor(private http: HttpClient) {
  }
  getScoresByStudentCode(student_code: string): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.apiCodeWalker+student_code, { headers, withCredentials: true });  }
  getScores(student_code: string): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.apiGetScoresByStudentCode+student_code, { headers, withCredentials: true });  }
}
