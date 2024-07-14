import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService{

    constructor(private router: Router) {}

    navigateToScores() {
      this.router.navigate(['/scores']);
    }

}
