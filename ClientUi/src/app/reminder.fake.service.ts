import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';

import { Reminder } from './reminder';
import * as json from '../../../testData.json';

let testData: Reminder[] = json.Reminder.map(i => {
  return { id: i.id, value: i.value }
});
let testData_empty: Reminder[] = [];

@Injectable({
  providedIn: 'root'
})
export class ReminderFakeService {

  constructor() { }

  fakeData: Reminder[] = testData;
  reminders: Subject<Reminder[]> = new Subject<Reminder[]>();

  public addReminder(newReminder: Reminder): Observable<Reminder> {
    this.fakeData = [...testData, newReminder ];
    this.updateReminders();
    return of(newReminder);
  }

  public updateReminders(): void {
    this.reminders.next(this.fakeData);
  }
}

