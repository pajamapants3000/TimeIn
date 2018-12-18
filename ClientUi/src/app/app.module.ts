import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from '../environments/environment';

import {
  MatListModule,
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule
} from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { ListRemindersComponent } from './list-reminders/list-reminders.component';

import { InMemoryDataService } from './in-memory-data.service';
import { ReminderService } from './reminder.service';

@NgModule({
  declarations: [
    AppComponent,
    AddReminderComponent,
    ListRemindersComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // uncomment for simple, WebAPI-free hands-on testing only
    //HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false}),
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

