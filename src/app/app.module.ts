import {MatListModule} from "@angular/material/list";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {NgModule, isDevMode, APP_INITIALIZER} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { ScoresComponent } from './components/scores/scores.component';
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
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
import {NotificationService} from "./components/services/notification.service";

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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}

