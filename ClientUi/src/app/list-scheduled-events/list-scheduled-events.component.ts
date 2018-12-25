import {
  Component,
  EventEmitter,
  OnInit,
  OnChanges,
  Input,
  Output,
  SimpleChange
} from '@angular/core';
import { Observable, of } from 'rxjs';

import { ScheduledEventService } from '../scheduled-event.service';
import { ScheduledEvent } from '../models/scheduled-event';

@Component({
  selector: 'app-list-scheduled-events',
  templateUrl: './list-scheduled-events.component.html',
  styleUrls: ['./list-scheduled-events.component.css']
})
export class ListScheduledEventsComponent implements OnInit, OnChanges {

  constructor(private service: ScheduledEventService) { }

  public scheduledEvents$: Observable<ScheduledEvent[]>;
  @Input() isUpdateAvailable: boolean;
  @Output() openDetailsEvent = new EventEmitter<number>();

  ngOnInit() {
    this.service.getScheduledEventList().subscribe(
      success => {
        this.scheduledEvents$ = of(success.sort(ScheduledEvent.compare))
      },
      error => { /* what to do here? */ },
      () => {} /* complete */
    );
    this.isUpdateAvailable = false;
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (this.isUpdateAvailable = true) {
      this.service.getScheduledEventList().subscribe(
        success => { this.scheduledEvents$ = of(success.sort(ScheduledEvent.compare)) },
        error => { /* what to do here? */ }
      );
      this.isUpdateAvailable = false;
    }
  }

  public openDetails(id?: number): void {
    this.openDetailsEvent.emit(id == null ? null : id);
  }

  public isPast(when: Date): boolean {
    if (when == null) return undefined;
    return (new Date(when.valueOf())).getTime() < Date.now();
  }
}
