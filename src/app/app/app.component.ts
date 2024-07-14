import {Component, NgModule, OnInit} from '@angular/core';
import {RouterService} from "../components/services/router.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  // ]
})
export class AppComponent implements OnInit{
  constructor(private routerService: RouterService) {
  }
    ngOnInit(): void {
      debugger;
      // this.routerService.navigateToScores(['/scores']);
    }

}
