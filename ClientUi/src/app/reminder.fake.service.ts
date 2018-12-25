import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';

import { Reminder } from './models/reminder';
import * as json from '../../../testData.json';

let testData: Reminder[] = json.Reminder.map(i => {
  return new Reminder({
    id: i.id,
    value: i.value,
    isCompleted: i.isCompleted
  });
});
let testData_empty: Reminder[] = [];

@Injectable({
  providedIn: 'root'
})
export class ReminderFakeService {

  constructor() { }

  public memberCalls: Map<string, any[]> = new Map<string, any[]>([
    [ "addReminder", [] ],
    [ "refreshRemindersList", [] ],
    [ "updateReminder", [] ]
  ]);

  public resetCalls(memberName: string = "") {
    if (memberName == "") {
      this.memberCalls.forEach((value, key) => {
        this.memberCalls.set(key, []);
      });
    } else {
      if (this.memberCalls.get(memberName) === null) {
        throw Error(`${memberName} is not a key in callsCount`)
      }
      this.memberCalls.set(memberName, []);
    }
  }

  fakeData: Reminder[] = testData;
  reminders: Subject<Reminder[]> = new Subject<Reminder[]>();

  public addReminder(newReminder: Reminder): Observable<Reminder> {
    this.fakeData = [...testData, newReminder ];
    this.refreshRemindersList();
    this.memberCalls.get("addReminder").push(newReminder);
    return of(newReminder);
  }

  public updateReminder(reminderPatch: Reminder): Observable<void> {
    let reminderToPatch = this.fakeData.find(x => x.id == reminderPatch.id);
    const reminderToPatchIndex = this.fakeData.indexOf(reminderToPatch);
    reminderToPatch.isCompleted = reminderPatch.isCompleted;
    this.fakeData[reminderToPatchIndex] = reminderToPatch;
    this.refreshRemindersList();
    this.memberCalls.get("updateReminder").push([reminderPatch]);
    return of();
  }

  public refreshRemindersList(): Observable<Reminder[]> {
    this.reminders.next(this.fakeData);
    this.memberCalls.get("refreshRemindersList").push([]);
    return of(this.fakeData);
  }
}

