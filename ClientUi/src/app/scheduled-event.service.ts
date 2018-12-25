import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { apiUrl } from './common'
import { ScheduledEvent } from './models/scheduled-event';

@Injectable({
  providedIn: 'root'
})
export class ScheduledEventService {

  constructor(private http: HttpClient) { }

  eventApiUrl: string = apiUrl + "/scheduledEvent";
  //eventApiUrl: string = inMemoryUrlBase + "/scheduledEvent";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  patchOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' })
  };

  public addScheduledEvent(newScheduledEvent: ScheduledEvent): Observable<ScheduledEvent> {
    let result: Observable<ScheduledEvent> = this.http.post<ScheduledEvent>(this.eventApiUrl,
                                                            newScheduledEvent,
                                                            this.httpOptions);
    return result.pipe(tap(
      success => {
        console.log(`ScheduledEvent #${success.id} added - Name: ${success.name}; ` +
                   `When: ${success.when}; ` +
                   `Duration: ${success.durationInMinutes} minutes.`);
      },
      error => {
        throw new Error(`Failed to add event: ${newScheduledEvent.name}. ` +
                                `URL: ${this.eventApiUrl}. ` +
                                error.message);
    }));
  }

  public getScheduledEvent(id: number): Observable<ScheduledEvent> {
    let result: Observable<ScheduledEvent> = this.http.get<ScheduledEvent>(
                                    `${this.eventApiUrl}/${id}`);

    return result.pipe(tap(
      success => {
        console.log(`Retrieved event "${success.name}" from server.`);
      },
      error => {
        throw new Error(`Failed to retrieve event #${id} from ` +
                                `${this.eventApiUrl}. ` +
                                error.message);
    }));
  }

  public getScheduledEventList(): Observable<ScheduledEvent[]> {
    let result: Observable<ScheduledEvent[]> = this.http.get<ScheduledEvent[]>(this.eventApiUrl);

    return result.pipe(tap(
      success => {
        console.log(`Retrieved list of ${success.length.toString()} events from server.`);
      },
      error => {
        throw new Error("Failed to retrieve events from " +
                                `${this.eventApiUrl}. ` +
                                error.message);
    }));
  }

  public updateScheduledEvent(patchScheduledEvent: ScheduledEvent): Observable<void> {
    let result: Observable<void> = this.http.patch<void>(
                                    `${this.eventApiUrl}/${patchScheduledEvent.id}`,
                                    patchScheduledEvent,
                                    this.patchOptions);
    return result.pipe(tap(
      success => {
        console.log(`ScheduledEvent #${patchScheduledEvent.id} updated.`);
      },
      error => {
        throw new Error(`Failed to update event #${patchScheduledEvent.id}. ` +
                                `URL: ${this.eventApiUrl}. ` +
                                error.message);
    }));
  }
}
