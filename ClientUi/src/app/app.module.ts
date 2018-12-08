import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { ListRemindersComponent } from './list-reminders/list-reminders.component';

import { InMemoryDataService } from './in-memory-data.service';
import { ReminderService } from './reminder.service';

@NgModule({
  declarations: [
    AppComponent,
    AddReminderComponent,
    ListRemindersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // remove this when ready to use real server
    environment.production ?
      [] : HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService,
      {
        dataEncapsulation: false
      }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
