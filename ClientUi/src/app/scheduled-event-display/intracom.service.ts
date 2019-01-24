import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ScheduledEvent } from '../models/scheduled-event';

@Injectable({
  providedIn: 'root'
})
export class IntracomService {
  public idSelectedSource = new Subject<number>();
  public scheduledEventsSource: Subject<ScheduledEvent[]> = new Subject<ScheduledEvent[]>();

  onIdSelected(id: number) {
    this.idSelectedSource.next(id);
  }

  onScheduledEventsUpdated(list: ScheduledEvent[]) {
    this.scheduledEventsSource.next(list);
  }

  getScheduledEvents$(): Observable<ScheduledEvent[]> {
    return this.scheduledEventsSource.asObservable();
  }

  getIdSelected$(): Observable<number> {
    return this.idSelectedSource.asObservable();
  }
}
