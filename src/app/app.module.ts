import {MatListModule} from "@angular/material/list";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {NgModule, isDevMode} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { ScoresComponent } from './components/scores/scores.component';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { VirtualCalendarComponent } from './components/virtual-calendar/virtual-calendar.component';
import { ScheduleModule, RecurrenceEditorModule } from '@syncfusion/ej2-angular-schedule';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {CalendarCommonModule, CalendarModule, DateAdapter} from "angular-calendar";
import {FullCalendarModule} from "@fullcalendar/angular";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import { LoginComponent } from './components/login/login.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import {MatDialogModule} from "@angular/material/dialog";
import { EventDialogComponent } from './components/event-dialog/event-dialog.component';
import { LoginVirtualComponent } from './components/login-virtual/login-virtual.component';
import { Top100Component } from './components/top100/top100.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DialogComponent } from './components/dialog/dialog.component';
import {AuthInterceptor} from "./components/services/auth.interceptor";
import { LoginForumComponent } from './components/login-forum/login-forum.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { GraphScoresComponent } from './components/graph-scores/graph-scores.component';
import {NgChartsModule} from "ng2-charts";
import {MatSelectModule} from "@angular/material/select";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';
import { GradeManagementComponent } from './components/grade-management/grade-management.component';
import { FileImportComponent } from './components/file-import/file-import.component';
import { SubjectsManagementsComponent } from './components/subjects-managements/subjects-managements.component';
import { ScoresManagementComponent } from './components/scores-management/scores-management.component';
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {PdfViewerModule} from "ng2-pdf-viewer";
import { WarningComponent } from './components/warning/warning.component';
import { FileStorageComponent } from './components/file-storage/file-storage.component';
import { SidebarCalendarComponent } from './components/sidebar-calendar/sidebar-calendar.component';
import { KmaScheduleComponent } from './components/kma-schedule/kma-schedule.component';
import { AuthorSupportComponent } from './components/author-support/author-support.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ScoresComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    VirtualCalendarComponent,
    LoginComponent,
    ScheduleComponent,
    EventDialogComponent,
    LoginVirtualComponent,
    Top100Component,
    DialogComponent,
    LoginForumComponent,
    ProfileComponent,
    PostDetailComponent,
    GraphScoresComponent,
    DashboardComponent,
    SidebarComponent,
    AdminHeaderComponent,
    DashboardOverviewComponent,
    StudentManagementComponent,
    GradeManagementComponent,
    FileImportComponent,
    SubjectsManagementsComponent,
    ScoresManagementComponent,
    WarningComponent,
    FileStorageComponent,
    SidebarCalendarComponent,
    KmaScheduleComponent,
    AuthorSupportComponent,
    ConfirmationModalComponent,
    // CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpClientJsonpModule,
    ScheduleModule, RecurrenceEditorModule, BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule, MatListModule, CalendarCommonModule,
    FullCalendarModule,
    NgChartsModule,
    MatSelectModule,
    PdfViewerModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }), MatSidenavModule, NgxExtendedPdfViewerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  })
export class AppModule {

}

