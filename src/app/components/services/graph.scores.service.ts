import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";
import {LoginDto} from "../dtos/login.dto";
import {GraphRequestDto} from "../dtos/graph.request.dto";

@Injectable({
  providedIn: 'root'
})
export class GraphScoresService{
  private apiGetAllSubjects = `${environment.apiBaseUrl}/graph/collect/subjects`;
  private apiGetGraphScores = `${environment.apiBaseUrl}/graph/filter`;
  private apiWarningSubjects = `${environment.apiBaseUrl}/graph/warning/subjects`;
  //
  private apiGetGraphScoresOnce = `${environment.apiBaseUrl}/graph/filter/once`;
  private apiGetAllSubjectsOnce = `${environment.apiBaseUrl}/graph/collect/subjects/once`;
  private apiWarningSubjectsOnce = `${environment.apiBaseUrl}/graph/warning/subjects/once`;
  constructor(private http: HttpClient) {
  }
  getAllSubjects(): Observable<any>{
    return this.http.get(this.apiGetAllSubjects);
  }
  getGraphScores(graphRequest: GraphRequestDto): Observable<any>{
    return this.http.post(this.apiGetGraphScores, graphRequest);
  }
  getGraphScoresOnce(graphRequest: GraphRequestDto): Observable<any>{
    return this.http.post(this.apiGetGraphScoresOnce, graphRequest);
  }
  getWarningSubjects(yearCourse: any): Observable<any>{
    return this.http.get(`${this.apiWarningSubjects}/${yearCourse}`);
  }
  getAllSubjectsOnce(): Observable<any>{
    return this.http.get(this.apiGetAllSubjectsOnce);
  }
  getWarningSubjectsOnce(yearCourse: any): Observable<any>{
    return this.http.get(`${this.apiWarningSubjectsOnce}/${yearCourse}`);
  }
}
