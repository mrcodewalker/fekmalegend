import {Component, EventEmitter, Output} from '@angular/core';
import {resetParseTemplateAsSourceFileForTest} from "@angular/compiler-cli/src/ngtsc/typecheck/diagnostics";
import {SearchService} from "../services/search.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './css/style.css']
})
export class HeaderComponent {
  checkHitButton: boolean = false;
  constructor(private searchService: SearchService) { }

  searchButtonClick() {
    this.searchService.notifySearchButtonClick();
  }
}
