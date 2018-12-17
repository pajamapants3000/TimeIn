import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { reminderUrl, reminderTestUrl } from './common'
import { Reminder } from './reminder';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(private http: HttpClient) { }

  reminders: Subject<Reminder[]> = new Subject<Reminder[]>();

  // use reminderTestUrl with in-memory-web-api
  apiUrl: string = reminderUrl;
  //apiUrl: string = reminderTestUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  patchOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' })
  };

  public addReminder(newReminder: Reminder): Observable<Reminder> {
    let result: Observable<Reminder> = this.http.post<Reminder>(this.apiUrl,
                                                            newReminder,
                                                            this.httpOptions);
    return result.pipe(tap(
      success => {
        this.refreshRemindersList().subscribe();
        console.log(`Reminder added: ${success.value}.`);
      },
      error => {
        throw new Error(`Failed to add reminder: ${newReminder.value}. ` +
                                `URL: ${this.apiUrl}. ` +
                                error.message);
    }));
  }

  public refreshRemindersList(): Observable<Reminder[]> {
    let result: Observable<Reminder[]> = this.http.get<Reminder[]>(this.apiUrl);

    return result.pipe(tap(
      success => {
        this.reminders.next(success);
        console.log(`Retrieved list of ${success.length.toString()} from server.`);
      },
      error => {
        throw new Error("Failed to retrieve reminders. " +
                                `URL: ${this.apiUrl}. ` +
                                error.message);
    }));
  }

  public updateReminder(patchReminder: Reminder): Observable<void> {
    let result: Observable<void> = this.http.patch<void>(
                                    `${this.apiUrl}/${patchReminder.id}`,
                                    patchReminder,
                                    this.patchOptions);
    return result.pipe(tap(
      success => {
        this.refreshRemindersList().subscribe();
        console.log(`Reminder #${patchReminder.id} updated.`);
      },
      error => {
        throw new Error(`Failed to update reminder #${patchReminder.id}. ` +
                                `URL: ${this.apiUrl}. ` +
                                error.message);
    }));
  }
}
