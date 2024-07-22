import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ScoresComponent} from "./components/scores/scores.component";
import {AppComponent} from "./app/app.component";
import {CommonModule} from "@angular/common";
import {HomeComponent} from "./components/home/home.component";
import {VirtualCalendarComponent} from "./components/virtual-calendar/virtual-calendar.component";
import {LoginComponent} from "./components/login/login.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";

const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: 'scores', component: ScoresComponent },
  { path : 'home', component: HomeComponent},
  { path : '', component: HomeComponent},
  { path: 'calendar', component: VirtualCalendarComponent},
  { path: 'login', component: LoginComponent},
  { path: 'schedule', component: ScheduleComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
