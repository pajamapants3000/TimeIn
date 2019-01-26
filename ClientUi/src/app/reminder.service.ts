import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { apiUrl } from './common'
import { Reminder } from './models/reminder';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(private http: HttpClient) { }

  reminderSource: Subject<Reminder[]> = new Subject<Reminder[]>();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  patchOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' })
  };

  public getReminderSource(): Subject<Reminder[]> {
    return this.reminderSource;
  }

  public addReminder(newReminder: Reminder): Observable<Reminder> {
    let result: Observable<Reminder> = this.http.post<Reminder>(`${apiUrl}/reminder`,
                                                            newReminder,
                                                            this.httpOptions);
    return result.pipe(tap(
      success => {
        this.refreshRemindersList();
        console.log(`Reminder added: ${success.value}.`);
    }));
  }

  public refreshRemindersList(): void {
    this.http.get<Reminder[]>(`${apiUrl}/reminder`).subscribe(
      success => {
        this.reminderSource.next(success);
        console.log(`Retrieved list of ${success.length.toString()} reminders from server.`);
      },
      error => {
        console.log("Failed to retrieve reminders. " +
                                `URL: ${apiUrl}/reminder. ` +
                                error.message);
    });
  }

  public updateReminder(patchReminder: Reminder): Observable<void> {
    let result: Observable<void> = this.http.patch<void>(
                                    `${apiUrl}/reminder/${patchReminder.id}`,
                                    patchReminder,
                                    this.patchOptions);
    return result.pipe(tap(
      success => {
        this.refreshRemindersList();
        console.log(`Reminder #${patchReminder.id} updated.`);
      },
      error => {
        throw new Error(`Failed to update reminder #${patchReminder.id}. ` +
                                `URL: ${apiUrl}/reminder. ` +
                                error.message);
    }));
  }
}
