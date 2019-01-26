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

  addReminder(newReminderValue: string): void {
    if (newReminderValue != '') {
      let reminderToAdd: Reminder = new Reminder({
        value: newReminderValue,
        isCompleted: false
      });

      this.service.addReminder(reminderToAdd).subscribe();
    }
  }
}
