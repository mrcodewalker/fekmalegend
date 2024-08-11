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
  isMenuOpen: boolean = false;
  constructor(private searchService: SearchService) { }

  searchButtonClick() {
    this.searchService.notifySearchButtonClick();
  }
  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }
  activeLink: string = 'home';

  setActive(link: string) {
    this.activeLink = link;
    this.isMenuOpen = !this.isMenuOpen;
  }

  isActive(link: string): boolean {
    return this.activeLink === link;
  }
  getNavLink(): string[] {
    const isWibu = localStorage.getItem('wibu') === 'true';
    return isWibu ? ['/schedule'] : ['/login'];
  }
  getCalendarLink(): string[] {
    const isJack = localStorage.getItem('jack') === 'true';
    return isJack ? ['/calendar'] : ['/login/virtual'];
  }
}
