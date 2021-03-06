import { Component, OnInit } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';

import { ScheduledEvent } from '../models/scheduled-event';
import { ScheduledEventService } from '../scheduled-event.service';
import { DisplayKind } from '../scheduled-event-display/display-kind';

@Component({
  selector: 'app-scheduled-events',
  templateUrl: './scheduled-events.component.html',
  styleUrls: ['./scheduled-events.component.css']
})
export class ScheduledEventsComponent implements OnInit {

  constructor(private service: ScheduledEventService) { }

  isDetailsOpen: boolean = false;
  detailsId: number = null;
  detailsUpdateSwitch: boolean = false;

  currentDisplayKind: DisplayKind = DisplayKind.List;
  scheduledEvents$: Observable<ScheduledEvent[]>;
  scheduledEventSource: Subject<ScheduledEvent[]>;

  ngOnInit() {
    this.scheduledEventSource = new Subject<ScheduledEvent[]>();
    this.scheduledEvents$ = this.scheduledEventSource.asObservable();
    this.updateScheduledEvents();
  }

  updateScheduledEvents(): void {
    this.service.getScheduledEventList().subscribe(
      success => {
        this.scheduledEventSource.next(success.sort(ScheduledEvent.compare));
      },
      error => { /* what to do here? */ },
      () => {} /* complete */
    );
  }

  onAddClicked(): void {
    console.log(`Opening dialog to add new scheduled event.`);
    if (this.detailsId == null) {
      this.detailsUpdateSwitch = !this.detailsUpdateSwitch;
    } else {
      this.detailsId = null;
    }

    this.isDetailsOpen = true;
  }

  openDetails(id: number) {
    console.log(`Opening scheduled event details for id: ${id}`);
    if (this.detailsId == id) {
      this.detailsUpdateSwitch = !this.detailsUpdateSwitch;
    } else {
      this.detailsId = id;
    }

    this.isDetailsOpen = true;
  }

  closeDetails(_isUpdated: boolean) {
    console.log(`Closed scheduled event details.`);
    if (_isUpdated) {
      this.updateScheduledEvents();
    }

    this.isDetailsOpen = false;
  }

  onDisplayKindChanged(kind: string) {
    switch (kind) {
      case "List":
        this.currentDisplayKind = DisplayKind.List;
        break;
      case "Monthly":
        this.currentDisplayKind = DisplayKind.Monthly;
        break;
    }
    this.updateScheduledEvents();
  }
}
