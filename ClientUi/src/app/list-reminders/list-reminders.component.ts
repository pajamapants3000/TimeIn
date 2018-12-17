import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatIconRegistry } from '@angular/material';

import { ReminderService } from '../reminder.service';
import { Reminder } from '../reminder';
import { reminderCompare } from '../common';

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
        this.reminders$ = of(next.sort(reminderCompare))
      },
      err => {},
      () => {}
    );
    this.service.refreshRemindersList().subscribe();
  }

  public completeReminder(id: number) {
    this.service.updateReminder({id: id, value: null, isCompleted: true}).subscribe();
  }
}

