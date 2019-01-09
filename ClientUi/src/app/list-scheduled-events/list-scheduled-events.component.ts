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
  @Input() updateSwitch: boolean = false;
  @Output() openDetailsEvent = new EventEmitter<number>();

  ngOnInit() {
    console.log("ngOnInit called for list-scheduled-events component.");
    this.service.getScheduledEventList().subscribe(
      success => {
        this.scheduledEvents$ = of(success.sort(ScheduledEvent.compare))
      },
      error => { /* what to do here? */ },
      () => {} /* complete */
    );
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.log("ngOnChanges called for list-scheduled-events component.");
    for (let propName in changes) {
      switch (propName) {
        case "updateSwitch":
          console.log("changes to updateSwitch detected in list-scheduled-events component.");
          this.service.getScheduledEventList().subscribe(
            success => { this.scheduledEvents$ = of(success.sort(ScheduledEvent.compare)) },
            error => { /* what to do here? */ }
          );
        }
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
