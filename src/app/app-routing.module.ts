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
import {LoginForumComponent} from "./components/login-forum/login-forum.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {GraphScoresComponent} from "./components/graph-scores/graph-scores.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthGuard} from "./components/guards/AuthGuard";
import {FileImportComponent} from "./components/file-import/file-import.component";
import {StudentManagementComponent} from "./components/student-management/student-management.component";
import {ScoresManagementComponent} from "./components/scores-management/scores-management.component";
import {SubjectsManagementsComponent} from "./components/subjects-managements/subjects-managements.component";
import {WarningComponent} from "./components/warning/warning.component";
import {AdminGuard} from "./components/guards/AdminGuard";
import {TeacherGuard} from "./components/guards/TeacherGuard";
import {FileStorageComponent} from "./components/file-storage/file-storage.component";
import {SidebarCalendarComponent} from "./components/sidebar-calendar/sidebar-calendar.component";
import {KmaScheduleComponent} from "./components/kma-schedule/kma-schedule.component";
import {AuthorSupportComponent} from "./components/author-support/author-support.component"; // Thêm module này nếu sử dụng Angular Material

const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: 'scores', component: ScoresComponent },
  { path : 'home', component: HomeComponent},
  { path : '', component: HomeComponent},
  { path: 'calendar', component: VirtualCalendarComponent},
  { path: 'login', component: LoginComponent},
  { path: 'schedule', component: KmaScheduleComponent},
  { path: 'login/virtual', component:  LoginVirtualComponent},
  { path: 'best/students', component:  Top100Component},
  { path: 'login/forum', component:  LoginForumComponent},
  { path: 'view/profile', component:  ProfileComponent},
  { path: 'sidebar/calendar', component:  SidebarCalendarComponent},
  { path: 'kma/schedule', component:  ScheduleComponent},
  { path: 'qrcode', component:  AuthorSupportComponent},
  { path: 'view/graph', component:  GraphScoresComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'admin/home', component: GraphScoresComponent, canActivate: [AuthGuard] }, // Child route
      { path: 'admin/user/management', component: StudentManagementComponent, canActivate: [AdminGuard] },
      { path: 'admin/import/pdf', component: FileImportComponent, canActivate: [AdminGuard] },
      { path: 'admin/scores/management', component: ScoresManagementComponent, canActivate: [AdminGuard] },
      { path: 'admin/subjects/management', component: SubjectsManagementsComponent, canActivate: [AdminGuard] },
      { path: 'admin/warning', component: WarningComponent, canActivate: [AuthGuard] },
      { path: 'admin/file/storage', component: FileStorageComponent, canActivate: [AuthGuard] },
      // { path: 'scores-management', component:  },
      // { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default to Home
    ]},
  { path: '**', component: HomeComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
