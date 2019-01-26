import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

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

  ngOnInit(): void {
    this.service.getReminderSource().subscribe(
      next => {
        this.reminders$ = of(next.sort(Reminder.compare))
      },
      err => { /* error */ },
      () => { /* complete */ }
    );
    this.service.refreshRemindersList();
  }

  public completeReminder(id: number): void {
    this.service.updateReminder(new Reminder({
      id: id,
      value: null,
      isCompleted: true
    })).subscribe();
  }

  public uncompleteReminder(id: number): void {
    this.service.updateReminder(new Reminder({
      id: id,
      value: null,
      isCompleted: false
    })).subscribe();
  }
}

