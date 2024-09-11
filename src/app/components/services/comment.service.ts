import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";
import {LoginDto} from "../dtos/login.dto";
import {SignupDto} from "../dtos/signup.dto";
import {UpdateDataDto} from "../dtos/update.data.dto";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiCreateNewComment = `${environment.apiLocalUrl}/comments/create`;
  private apiCollectComments = `${environment.apiLocalUrl}/comments/collect`;
  private apiUpdateComment = `${environment.apiLocalUrl}/comments/update`;
  private apiDeleteComment = `${environment.apiLocalUrl}/comments/delete`;
  constructor(private http: HttpClient) {
  }

  collectData(id: any): Observable<any> {
    return this.http.get(this.apiCollectComments+`/${id}`);
  }
  createComment(comment: any): Observable<any>{
    return this.http.post(this.apiCreateNewComment, comment);
  }
  updateComment(updateDTO: UpdateDataDto): Observable<any>{
    return this.http.post(this.apiUpdateComment+`/${updateDTO.id}`, updateDTO);
  }
  deleteComment(id: any): Observable<any>{
    return this.http.get(this.apiDeleteComment+`/${id}`);
  }
  // mrcodewalker
}
