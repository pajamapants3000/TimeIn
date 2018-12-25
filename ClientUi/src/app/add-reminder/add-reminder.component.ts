import { Component } from '@angular/core';

import { ReminderService } from '../reminder.service';
import { Reminder } from '../models/reminder';

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.css']
})
export class AddReminderComponent {

  constructor(private service: ReminderService) { }

  addReminder(newReminder: string): void {
    if (newReminder != '') {
      let reminderToAdd: Reminder = new Reminder({
        value: newReminder,
        isCompleted: false
      });
      this.service.addReminder(reminderToAdd).subscribe();
    }
  }
}
