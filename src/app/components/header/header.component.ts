import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {resetParseTemplateAsSourceFileForTest} from "@angular/compiler-cli/src/ngtsc/typecheck/diagnostics";
import {SearchService} from "../services/search.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './css/style.css']
})
export class HeaderComponent implements OnInit{
  checkHitButton: boolean = false;
  isMenuOpen: boolean = false;
  isAdmin: boolean = false;
  urlRedirect: string = '';
  isTeacher: boolean = false;
  constructor(private searchService: SearchService,
              private authService: AuthService) { }
  ngOnInit() {
    this.authService.role$.subscribe(role => {
      this.isAdmin = (role?.toLowerCase() === 'admin');
      this.isTeacher = (role?.toLowerCase() === 'teacher');
    });
  }

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
    return isWibu ? ['/kma/schedule'] : ['/login'];
  }
  getRoomLink(): string[] {
    return ['/room'];
  }
  getCalendarLink(): string[] {
    const isJack = localStorage.getItem('jack') === 'true';
    return isJack ? ['/calendar'] : ['/login/virtual'];
  }
}
