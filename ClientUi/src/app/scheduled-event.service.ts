import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { apiUrl, storedUtcDateToDate } from './common'
import { ScheduledEvent } from './models/scheduled-event';
import { AppComponent } from './app.component';

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
    console.log(`Adding new scheduled event...`);
    let result: Observable<ScheduledEvent> = this.http.post<ScheduledEvent>(this.eventApiUrl,
                                                            newScheduledEvent,
                                                            this.httpOptions);
    return result.pipe(tap(
      success => {
        console.log(`Scheduled Event id #${success.id} added - Name: ${success.name}; ` +
                   `When: ${success.when}; ` +
                   `Duration: ${success.durationInMinutes} minutes.`);
      },
      error => {
        throw new Error(`Failed to add scheduled event id #${newScheduledEvent.name} at ` +
                                `URL ${this.eventApiUrl}: ` +
                                error.message);
    }));
  }

  public getScheduledEvent(id: number): Observable<ScheduledEvent> {
    console.log(`Requesting scheduled event id #${id}...`);
    let result: Observable<ScheduledEvent> = this.http.get<ScheduledEvent>(
                                    `${this.eventApiUrl}/${id}`)
      .pipe(map(se => {
        se.when = storedUtcDateToDate(se.when);
        return se;
      }));

    return result.pipe(tap(
      success => {
        console.log(`Retrieved scheduled event id #${success.id} from server.`);
      },
      error => {
        throw new Error(`Failed to retrieve event #${id} from ` +
                                `${this.eventApiUrl}. ` +
                                error.message);
    }));
  }

  public getScheduledEventList(): Observable<ScheduledEvent[]> {
    console.log("Requesting scheduled-event list");
    let result: Observable<ScheduledEvent[]> = this.http.get<ScheduledEvent[]>(this.eventApiUrl)
      .pipe(map(list => list.map(se => {
        se.when = storedUtcDateToDate(se.when);
        return se;
      })));

    return result.pipe(tap(
      success => {
        console.log(`Retrieved list of ${success.length.toString()} scheduled events from server.`);
      },
      error => {
        throw new Error("Failed to retrieve events from " +
                                `${this.eventApiUrl}: ` +
                                error.message);
    }));
  }

  public updateScheduledEvent(patchScheduledEvent: ScheduledEvent): Observable<void> {
    console.log(`Updating scheduled event id #${patchScheduledEvent.id}...`);
    if (AppComponent.useInMemoryWebApi) {
      return this.updateScheduledEvent_inMemory(patchScheduledEvent);
    } else {
      return this.updateScheduledEvent_API(patchScheduledEvent);
    }
  }

  public updateScheduledEvent_inMemory(patchScheduledEvent: ScheduledEvent): Observable<void> {
    throw new Error("UpdateScheduledEvent_inMemory not implemented.");
  }

  public updateScheduledEvent_API(patchScheduledEvent: ScheduledEvent): Observable<void> {
    let result: Observable<void> = this.http.patch<void>(
                                    `${this.eventApiUrl}/${patchScheduledEvent.id}`,
                                    patchScheduledEvent,
                                    this.patchOptions);
    return result.pipe(tap(
      success => {
        console.log(`Scheduled Event id #${patchScheduledEvent.id} updated.`);
      },
      error => {
        throw new Error(`Failed to update scheduled event id #${patchScheduledEvent.id} at ` +
                                `URL ${this.eventApiUrl}: ` +
                                error.message);
    }));
  }
}
