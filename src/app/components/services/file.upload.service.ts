import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";
import {LoginDto} from "../dtos/login.dto";
import {GraphRequestDto} from "../dtos/graph.request.dto";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService{
  private apiUploadFile = `${environment.apiBaseUrl}/file/upload`;
  private apiCollectAllFiles = `${environment.apiBaseUrl}/file/download`;
  private apiUploadFileToDataLake = 'http://192.168.1.103:8086/upload';
  // private apiUploadFileToDataLake = 'http://42.112.211.165:8888/upload';

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }
  getAllFiles(pageNumber: number): Observable<any>{
    return this.http.get(this.apiCollectAllFiles+`?pageNumber=${pageNumber}`);
  }
  uploadFile(file: any): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', this.authService.getUserId()+"");
    return this.http.post(this.apiUploadFile, formData, {
      responseType: 'text'  // Thêm responseType để tránh lỗi JSON parsing
    });
  }
  uploadFileToDataLake(file: any){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('web_name', 'WEB_KHAO_THI');

    return this.http.post<any>(this.apiUploadFileToDataLake, formData);
  }
}
