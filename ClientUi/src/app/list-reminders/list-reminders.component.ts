import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatIconRegistry } from '@angular/material';

import { ReminderService } from '../reminder.service';
import { Reminder } from '../models/reminder';

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
      next => {
        this.reminders$ = of(next.sort(Reminder.compare))
      },
      err => {},
      () => {} /* complete */
    );
    this.service.refreshRemindersList().subscribe();
  }

  public completeReminder(id: number) {
    this.service.updateReminder(new Reminder({id: id, value: null, isCompleted: true})).subscribe();
  }
  public uncompleteReminder(id: number) {
    this.service.updateReminder(new Reminder({id: id, value: null, isCompleted: false})).subscribe();
  }
}

