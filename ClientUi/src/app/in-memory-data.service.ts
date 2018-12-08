import { InMemoryDbService, ParsedRequestUrl } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { REMINDERS } from './mock-reminders'
import { REMINDERS_EMPTY } from './mock-reminders-empty'
import { Reminder } from './reminder';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  public useEmptyRemindersList: Boolean = false;

  createDb() {
    const reminder = this.useEmptyRemindersList ? REMINDERS_EMPTY : REMINDERS;

    return {reminder};
  }

  constructor() { }

  genId(reminders: Reminder[]): number {
    return reminders.length > 0 ?
      Math.max(...reminders.map(reminder => reminder.id)) + 1 :
      11;
  }
}
