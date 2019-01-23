import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatListModule,
  MatButtonModule,
} from '@angular/material';


import { AppModule } from '../app.module';
import { ListComponent } from './list/list.component';
import { ScheduledEventDisplayComponent } from './scheduled-event-display/scheduled-event-display.component';
import { MonthlyCalendarComponent } from './monthly-calendar/monthly-calendar.component';


@NgModule({
  declarations: [ListComponent, ScheduledEventDisplayComponent, MonthlyCalendarComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
  ],
  exports: [
    ScheduledEventDisplayComponent,
    ListComponent,
    MonthlyCalendarComponent,
  ],
  entryComponents: [
    ScheduledEventDisplayComponent,
    ListComponent,
    MonthlyCalendarComponent,
  ],
})
export class ScheduledEventDisplayModule { }
