import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from '../environments/environment';

import {
  MatListModule,
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatSidenavModule,
  MatTabsModule
} from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { ListRemindersComponent } from './list-reminders/list-reminders.component';
import { ListScheduledEventsComponent } from './list-scheduled-events/list-scheduled-events.component';
import { ScheduledEventDetailsComponent } from './scheduled-event-details/scheduled-event-details.component';
import { ScheduledEventsComponent } from './scheduled-events/scheduled-events.component';

import { InMemoryDataService } from './in-memory-data.service';
import { ReminderService } from './reminder.service';
import { ScheduledEventService } from './scheduled-event.service';

@NgModule({
  declarations: [
    AppComponent,
    AddReminderComponent,
    ListRemindersComponent,
    ListScheduledEventsComponent,
    ScheduledEventDetailsComponent,
    ScheduledEventsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // uncomment for simple, WebAPI-free hands-on testing only
    (!AppComponent.useInMemoryWebApi || environment.production) ? [] :
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false}),
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

