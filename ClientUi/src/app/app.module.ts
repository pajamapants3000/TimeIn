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
  MatButtonToggleModule,
  MatFormFieldModule,
  MatIconModule,
  MatSidenavModule,
  MatTabsModule
} from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScheduledEventDisplayModule } from './scheduled-event-display/scheduled-event-display.module';

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
    (!AppComponent.useInMemoryWebApi || environment.production) ? [] :
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false}),
    MatListModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    BrowserAnimationsModule,
    FormsModule,
    ScheduledEventDisplayModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

