import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RankingService{
  private apiGetRanking = `${environment.apiBaseUrl}/ranking/school`;
  private apiClassRanking = `${environment.apiBaseUrl}/ranking/class`;
  private apiBlockRanking = `${environment.apiBaseUrl}/ranking/block`;
  private apiMajorRanking = `${environment.apiBaseUrl}/ranking/major`;
  private apiBlockDetailsRanking = `${environment.apiBaseUrl}/ranking/block_details`;
  private apiScholarShip = `${environment.apiBaseUrl}/semester/scholarship`;

  private apiGetRankingTop1 = `${environment.apiBaseUrl}/ranking/top/1`;
  private apiGetRankingTop2 = `${environment.apiBaseUrl}/ranking/top/2`;
  private apiGetRankingTop3 = `${environment.apiBaseUrl}/ranking/top/3`;

  constructor(private http: HttpClient) {
  }
  getRanking(student_code: string): Observable<any>{
    const params = new HttpParams().set('student_code', student_code);
    return this.http.get<any>(this.apiGetRanking, { params });
  }
  getScholarShip(student_code: string): Observable<any>{
    const params = new HttpParams().set('student_code', student_code);
    return this.http.get<any>(this.apiScholarShip, { params });
  }
  getClassRanking(student_code: string): Observable<any>{
    const params = new HttpParams().set('student_code', student_code);
    return this.http.get<any>(this.apiClassRanking, { params });
  }
  getMajorRanking(student_code: string): Observable<any>{
    const params = new HttpParams().set('student_code', student_code);
    return this.http.get<any>(this.apiMajorRanking, { params });
  }
  getBlockRanking(student_code: string): Observable<any>{
    const params = new HttpParams().set('student_code', student_code);
    return this.http.get<any>(this.apiBlockRanking, { params });
  }
  getBlockDetailRanking(student_code: string): Observable<any>{
    const params = new HttpParams().set('student_code', student_code);
    return this.http.get<any>(this.apiBlockDetailsRanking, { params });
  }
  getRankingTop1() :Observable<any>{
    return this.http.get<any>(this.apiGetRankingTop1);
  }
  getRankingTop2() :Observable<any>{
    return this.http.get<any>(this.apiGetRankingTop2);
  }
  getRankingTop3() :Observable<any>{
    return this.http.get<any>(this.apiGetRankingTop3);
  }
}
