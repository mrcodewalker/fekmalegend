import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService{
  private apiGetSchedule = `${environment.apiBaseUrl}/schedules/schedule`;
  private apiGetSubjects = `${environment.apiBaseUrl}/schedules/subjects`;
  private apiGetDetailSubject = `${environment.apiBaseUrl}/schedules/detail/subject`
  private apiWannaSubject = `${environment.apiBaseUrl}/schedules/wanna`;
  constructor(private http: HttpClient) {
  }
  getSchedule(student_course: string): Observable<any>{
    const params = new HttpParams().set('student_course', student_course);
    return this.http.get<any>(this.apiGetSchedule, { params });
  }
  getSubjects(student_course: string): Observable<any>{
    const params = new HttpParams().set('student_course', student_course);
    return this.http.get<any>(this.apiGetSubjects, { params });
  }
  getDetailSubject(subject_name: string): Observable<any>{
    const params = new HttpParams().set('subject_name', subject_name);
    return this.http.get<any>(this.apiGetDetailSubject, { params });
  }
  wannaSubjects(subject_course: string, day_in_week: string[]): Observable<any> {
    // Tạo một đối tượng HttpParams
    let params = new HttpParams();

    // Lặp qua mảng day_in_week để thêm từng giá trị vào params
    day_in_week.forEach(day => {
      params = params.append('day_in_week', day);
    });

    // Thực hiện request POST với params đã tạo
    return this.http.post<any>(`${this.apiWannaSubject}/${subject_course}`, {}, { params });
  }
}
