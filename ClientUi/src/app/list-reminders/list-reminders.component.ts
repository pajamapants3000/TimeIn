import { Component, OnInit } from '@angular/core';

import { ReminderService } from '../reminder.service';
import { Reminder } from '../reminder';

@Component({
  selector: 'app-list-reminders',
  templateUrl: './list-reminders.component.html',
  styleUrls: ['./list-reminders.component.css']
})
export class ListRemindersComponent implements OnInit {

  reminders: Reminder[];

  constructor(private service: ReminderService) { }

  ngOnInit() {
    this.listReminders();
  }

  listReminders(): void {
    this.service.listReminders().subscribe(
      list => { this.reminders = list; },
      fail => { throw new Error(fail.message); }
    )
  }
}
