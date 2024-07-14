import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchButtonClickSource = new Subject<void>();

  searchButtonClick$ = this.searchButtonClickSource.asObservable();

  notifySearchButtonClick() {
    this.searchButtonClickSource.next();
  }
}
