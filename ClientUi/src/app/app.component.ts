import { Component } from '@angular/core';
import { ReminderService } from './reminder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Welcome to TimeIn!';

  constructor (){ }
}
