import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ReminderService } from '../reminder.service';
import { Reminder } from '../reminder';

@Component({
  selector: 'app-list-reminders',
  templateUrl: './list-reminders.component.html',
  styleUrls: ['./list-reminders.component.css']
})
export class ListRemindersComponent implements OnInit {

  reminders$: Observable<Reminder[]>;

  constructor(private service: ReminderService) { }

  ngOnInit() {
    this.service.reminders.subscribe(
      next => this.reminders$ = of(next),
      err => {},
      () => {}
    );
    this.service.updateReminders();
  }
}
