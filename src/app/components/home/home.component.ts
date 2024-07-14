import {Component, OnInit} from '@angular/core';
import {ScoreService} from "../services/score.service";
import {RankingService} from "../services/ranking.service";
import {SearchService} from "../services/search.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'
    , './assets/css/style.css', './assets/vendor/bootstrap-icons/bootstrap-icons.css', './assets/vendor/bootstrap/css/bootstrap.min.css'
    ,'./assets/vendor/boxicons/css/boxicons.min.css', './assets/vendor/glightbox/css/glightbox.min.css', './assets/vendor/remixicon/remixicon.css',
    './assets/vendor/swiper/swiper-bundle.min.css']
})
export class HomeComponent implements OnInit{
  hitButton: boolean = false;
  constructor(private scoreService: ScoreService,
              private rankingService: RankingService,
              private searchService: SearchService,
              private route: Router) {
  }

  ngOnInit(): void {
      this.searchService.searchButtonClick$.subscribe(() => {
        this.route.navigate(['scores']);
      });
    }


}
