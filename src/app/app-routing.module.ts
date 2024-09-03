import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ScoresComponent} from "./components/scores/scores.component";
import {AppComponent} from "./app/app.component";
import {CommonModule} from "@angular/common";
import {HomeComponent} from "./components/home/home.component";
import {VirtualCalendarComponent} from "./components/virtual-calendar/virtual-calendar.component";
import {LoginComponent} from "./components/login/login.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {LoginVirtualComponent} from "./components/login-virtual/login-virtual.component";
import {Top100Component} from "./components/top100/top100.component";
import { MatDialogModule } from '@angular/material/dialog';
import {LoginForumComponent} from "./components/login-forum/login-forum.component"; // Thêm module này nếu sử dụng Angular Material

const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: 'scores', component: ScoresComponent },
  { path : 'home', component: HomeComponent},
  { path : '', component: HomeComponent},
  { path: 'calendar', component: VirtualCalendarComponent},
  { path: 'login', component: LoginComponent},
  { path: 'schedule', component: ScheduleComponent},
  { path: 'login/virtual', component:  LoginVirtualComponent},
  { path: 'best/students', component:  Top100Component},
  { path: 'login/forum', component:  LoginForumComponent},
  { path: '**', component: HomeComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
