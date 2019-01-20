import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ScheduledEvent } from '../models/scheduled-event';

@Injectable({
  providedIn: 'root'
})
export class IntracomService {
  public idSelectedSource = new Subject<number>();
  public scheduledEventsSource = new Subject<ScheduledEvent[]>();

  idSelected$ = this.idSelectedSource.asObservable();
  scheduledEvents$ = this.scheduledEventsSource.asObservable();

  onIdSelected(id: number) {
    this.idSelectedSource.next(id);
  }

  onScheduledEventsUpdated(list: ScheduledEvent[]) {
    this.scheduledEventsSource.next(list);
  }

  getScheduledEvents$(): Observable<ScheduledEvent[]> {
    return this.scheduledEvents$;
  }

  getIdSelected$(): Observable<number> {
    return this.idSelected$;
  }
}
