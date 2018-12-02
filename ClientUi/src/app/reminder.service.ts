import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { remindersUrl } from './common'
import { Reminder } from './reminder';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public addReminder(newReminder: Reminder): Observable<Reminder> {
    let result: Observable<Reminder> = this.http.post<Reminder>(remindersUrl,
                                                            newReminder,
                                                            this.httpOptions);

    return result.pipe(tap(reminder =>
      console.log(`Reminder added: ${reminder.value}.`)
    ));
  }

  public listReminders(): Observable<Reminder[]> {
    let result: Observable<Reminder[]> = this.http.get<Reminder[]>(remindersUrl);

    return result.pipe(tap(reminders =>
      console.log(`Retrieved list of ${reminders.length.toString()} from server.`)
    ));
  }

}
