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
export class PostService {
  private apiCreatePost = `${environment.apiLocalUrl}/posts/create`;
  private apiCollectPost = `${environment.apiLocalUrl}/posts/collect`;
  private apiIncreaseView = `${environment.apiLocalUrl}/posts/increase`;
  private apiUpdatePost = `${environment.apiLocalUrl}/posts/update`;
  private apiDeletePost = `${environment.apiLocalUrl}/posts/delete`;
  private apiCollectPostsDecrease = `${environment.apiLocalUrl}/posts/collect/reverse`;
  private apiCollectPopularPost = `${environment.apiLocalUrl}/posts/collect/popular`;
  private apiSearchPosts = `${environment.apiLocalUrl}/posts/collect/by/key`;
  private apiCollectPopularWeek = `${environment.apiLocalUrl}/posts/collect/popular/week`;
  private apiCollectPopularAllTimes = `${environment.apiLocalUrl}/posts/collect/popular/all/times`;
  private apiCollectNoReplies = `${environment.apiLocalUrl}/posts/collect/no/replies`;


  constructor(private http: HttpClient) {
  }
  createPost(post: any): Observable<any>{
    return this.http.post(this.apiCreatePost, post);
  }
  collectData(page: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(this.apiCollectPost, { params });
  }
  collectDataReverse(page: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(this.apiCollectPostsDecrease, { params });
  }
  collectPopularData(page: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(this.apiCollectPopularPost, { params });
  }
  searchPosts(searchTerm: any, page: any): Observable<any>{
    let params = new HttpParams()
      .set('searchTerm', searchTerm.toString())
      .set('page', page.toString());
    return this.http.get(this.apiSearchPosts, { params });
  }
  popularThisWeek(page: number): Observable<any>{
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(this.apiCollectPopularWeek, { params });
  }
  popularAllTimes(page: number):Observable<any>{
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(this.apiCollectPopularAllTimes, { params });
  }
  noReplies(page: number):Observable<any>{
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(this.apiCollectNoReplies, { params });
  }
  increaseView(id: any): Observable<any> {
    return this.http.get(this.apiIncreaseView+`/${id}`)
  }
  updatePost(updateDTO: UpdateDataDto): Observable<any>{
    return this.http.post(this.apiUpdatePost+`/${updateDTO.id}`, updateDTO);
  }
  deletePost(id: any): Observable<any>{
    return this.http.get(this.apiDeletePost+`/${id}`);
  }
}
