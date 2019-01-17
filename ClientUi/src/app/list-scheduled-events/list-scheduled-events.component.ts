import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
} from '@angular/core';
import { Observable, of } from 'rxjs';

import { ScheduledEventService } from '../scheduled-event.service';
import { ScheduledEvent } from '../models/scheduled-event';

@Component({
  selector: 'app-list-scheduled-events',
  templateUrl: './list-scheduled-events.component.html',
  styleUrls: ['./list-scheduled-events.component.css']
})
export class ListScheduledEventsComponent implements OnInit {

  constructor(private service: ScheduledEventService) { }

  @Input() scheduledEvents$: Observable<ScheduledEvent[]>;
  @Output() openDetailsEvent = new EventEmitter<number>();

  ngOnInit() {
    console.log("ngOnInit called for list-scheduled-events component.");
  }

  public openDetails(id: number): void {
    this.openDetailsEvent.emit(id);
  }

  public isPast(when: Date): boolean {
    if (when == null) return undefined;
    return (new Date(when.valueOf())).getTime() < Date.now();
  }
}
