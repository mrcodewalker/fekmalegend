import {MatListModule} from "@angular/material/list";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    ScoresComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    VirtualCalendarComponent,
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}

