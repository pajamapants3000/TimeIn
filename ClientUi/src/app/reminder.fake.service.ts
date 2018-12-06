import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';

import { Reminder } from './reminder';
import { REMINDERS } from './mock-reminders';

@Injectable({
  providedIn: 'root'
})
export class ReminderFakeService {

  constructor() { }

  fakeData: Reminder[] = REMINDERS;
  reminders: Subject<Reminder[]> = new Subject<Reminder[]>();

  public addReminder(newReminder: Reminder): Observable<Reminder> {
    this.fakeData = [...REMINDERS, newReminder ];
    this.updateReminders();
    return of(newReminder);
  }

  public updateReminders(): void {
    this.reminders.next(this.fakeData);
  }
}

