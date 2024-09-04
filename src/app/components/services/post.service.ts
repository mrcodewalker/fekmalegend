import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";
import {LoginDto} from "../dtos/login.dto";
import {SignupDto} from "../dtos/signup.dto";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiCollectPost = `${environment.apiLocalUrl}/posts/collect`;


  constructor(private http: HttpClient) {
  }

  collectData(page: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(this.apiCollectPost, { params });
  }
}
