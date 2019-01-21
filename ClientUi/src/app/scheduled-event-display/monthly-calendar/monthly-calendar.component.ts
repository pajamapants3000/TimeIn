import {
  Component,
} from '@angular/core';
import { Observable } from 'rxjs';

import { ScheduledEvent } from '../../models/scheduled-event';

@Component({
  selector: 'app-monthly-calendar',
  templateUrl: './monthly-calendar.component.html',
  styleUrls: ['./monthly-calendar.component.css']
})
export class MonthlyCalendarComponent {

  title: string;

  constructor() {
    this.title = "monthly-calendar works!";
  }
}
