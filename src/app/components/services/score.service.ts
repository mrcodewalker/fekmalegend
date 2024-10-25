import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScoreService{
  private apiGetScoresByStudentCode = `${environment.apiBaseUrl}/ranking/scores/`;
  private apiCodeWalker = `${environment.apiCodeWalker}/ranking/scores/`;
  private apiImportPDFFile = `${environment.apiCodeWalker}/scores/score`;
  private apiRankingUpdate = `${environment.apiCodeWalker}/ranking/gpa_update`;
  private apiClassRankingUpdate = `${environment.apiCodeWalker}/ranking/update/class_ranking`;
  private apiBlockRankingUpdate = `${environment.apiCodeWalker}/ranking/update/block_ranking`;
  private apiBlockDetailRankingUpdate = `${environment.apiCodeWalker}/ranking/update/block_detail_ranking`;
  private apiMajorRankingUpdate = `${environment.apiCodeWalker}/ranking/update/major_ranking`;
  private apiUpdateSemesterTable = `${environment.apiCodeWalker}/ranking/update/semester/table`;
  private apiUpdateSemesterRanking = `${environment.apiCodeWalker}/ranking/update/semester_ranking`;
  private apiUpdateScholarship = `${environment.apiCodeWalker}/ranking/update/scholarship`;
  private apiUpdateAllQuery = `${environment.apiCodeWalker}/ranking/query/update`;
  private apiUpdateData = `${environment.apiCodeWalker}/ranking/update/data`;
  private updateSubject = new Subject<string>();
  updateProgress$ = this.updateSubject.asObservable();
  postRequestWithoutPayload(apiUrl: string): Observable<any> {
    return this.http.post(apiUrl,null,{});
  }

  constructor(private http: HttpClient) {
  }
  listenForRankUpdates(): Observable<string> {
    return new Observable<string>(observer => {
      const eventSource = new EventSource(this.apiUpdateAllQuery);

      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        observer.error('EventSource failed: ' + error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    });
  }
  getScoresByStudentCode(student_code: string): Observable<any> {
    return this.http.get(`${this.apiCodeWalker}${student_code}`);
  }
  getScores(student_code: string): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.apiGetScoresByStudentCode+student_code, { headers, withCredentials: true });  }
  importPDF(file: File, type: string, semester: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('semester', semester);
    let newApi = this.apiImportPDFFile;
    if (type.toLowerCase()==='không có trang giới thiệu'){
      newApi = this.apiImportPDFFile+"/complement";
    }
    return this.http.post(newApi, formData);
  }
  updateRanking(): Observable<any> {
    return this.postRequestWithoutPayload(this.apiRankingUpdate);
  }
  updateData(): Observable<any> {
    return this.postRequestWithoutPayload(this.apiUpdateData);
  }
  updateClassRanking(): Observable<any>{
    return this.postRequestWithoutPayload(this.apiClassRankingUpdate);
  }
  updateBlockRanking(): Observable<any>{
    return this.postRequestWithoutPayload(this.apiBlockRankingUpdate);
  }
  updateBlockDetailRanking(): Observable<any>{
    return this.postRequestWithoutPayload(this.apiBlockDetailRankingUpdate);
  }
  updateMajorRanking(): Observable<any>{
    return this.postRequestWithoutPayload(this.apiMajorRankingUpdate);
  }
  updateSemesterTable(): Observable<any>{
    return this.postRequestWithoutPayload(this.apiUpdateSemesterTable);
  }
  updateSemesterRanking(): Observable<any>{
    return this.postRequestWithoutPayload(this.apiUpdateSemesterRanking);
  }
  updateScholarship(): Observable<any>{
    return this.postRequestWithoutPayload(this.apiUpdateScholarship);
  }
}
