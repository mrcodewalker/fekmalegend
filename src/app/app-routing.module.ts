import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ScoresComponent} from "./components/scores/scores.component";
import {AppComponent} from "./app/app.component";
import {CommonModule} from "@angular/common";
import {HomeComponent} from "./components/home/home.component";
import {VirtualCalendarComponent} from "./components/virtual-calendar/virtual-calendar.component";

const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: 'scores', component: ScoresComponent },
  { path : 'home', component: HomeComponent},
  { path : '', component: HomeComponent},
  { path: 'calendar', component: VirtualCalendarComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
