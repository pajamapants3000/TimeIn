import { Component } from '@angular/core';

import { ReminderService } from '../reminder.service';
import { Reminder } from '../reminder';

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.css']
})
export class AddReminderComponent {

  constructor(private service: ReminderService) { }

  addReminder(newReminder: string): void {
    if (newReminder != '') {
      this.service.addReminder({ value: newReminder } as Reminder).subscribe();
    }
  }
}
