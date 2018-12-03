import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { remindersUrl } from './common'
import { Reminder } from './reminder';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(private http: HttpClient) { }

  reminders: Subject<Reminder[]> = new Subject<Reminder[]>();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public addReminder(newReminder: Reminder): Observable<Reminder> {
    let result: Observable<Reminder> = this.http.post<Reminder>(remindersUrl,
                                                            newReminder,
                                                            this.httpOptions);
    return result.pipe(tap(
      success => {
        this.updateReminders(),
        console.log(`Reminder added: ${success.value}.`);
      },
      error => {
        throw new Error(`Failed to add reminder: ${newReminder.value}`);
    }));
  }

  public updateReminders(): void {
    let result: Observable<Reminder[]> = this.http.get<Reminder[]>(remindersUrl);

    result.subscribe(
      success => {
        this.reminders.next(success);
        console.log(`Retrieved list of ${success.length.toString()} from server.`);
      },
      error => {throw new Error("Failed to retrieve reminders")}
    );
  }

}
