import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatListModule,
  MatButtonModule,
} from '@angular/material';


import { AppModule } from '../app.module';
import { ListComponent } from './list/list.component';
import { ScheduledEventDisplayComponent } from './scheduled-event-display/scheduled-event-display.component';


@NgModule({
  declarations: [ListComponent, ScheduledEventDisplayComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
  ],
  exports: [
    ScheduledEventDisplayComponent,
    ListComponent,
  ],
})
export class ScheduledEventDisplayModule { }
