import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatSidenav } from '@angular/material';

import { ScheduledEvent } from '../models/scheduled-event';
import { ScheduledEventService } from '../scheduled-event.service';
import { ScheduledEventDetailsComponent } from
  '../scheduled-event-details/scheduled-event-details.component';
import { DisplayKind } from '../scheduled-event-display/display-kind';

@Component({
  selector: 'app-scheduled-events',
  templateUrl: './scheduled-events.component.html',
  styleUrls: ['./scheduled-events.component.css']
})
export class ScheduledEventsComponent implements OnInit {

  @ViewChild('sidenav') private sidenav: MatSidenav;
  @ViewChild('details')
  private details: ScheduledEventDetailsComponent;

  currentDisplayKind: DisplayKind = DisplayKind.List;
  scheduledEvents$: Observable<ScheduledEvent[]>;
  scheduledEventSource: Subject<ScheduledEvent[]>;

  constructor(private service: ScheduledEventService) {
    this.scheduledEventSource = new Subject<ScheduledEvent[]>();
    this.scheduledEvents$ = this.scheduledEventSource.asObservable();
  }

  ngOnInit() {
    console.log("ngOnInit called for scheduled-events component");
    this.updateScheduledEvents();
  }

  onAddClicked(): void {
    console.log(`Opening dialog to add new scheduled event.`);
    this.details.detailsId = null;
    this.sidenav.opened = true;
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

  openDetails(id: number) {
    console.log(`Opening scheduled event details for id: ${id}`);
    this.details.detailsId = id;
    this.sidenav.opened = true;
  }

  closeDetails(isUpdated: boolean) {
    console.log(`Closed scheduled event details.`);
    if (isUpdated) {
      this.updateScheduledEvents();
    }

    this.sidenav.opened = false;
  }

  updateScheduledEvents(): void {
    this.service.getScheduledEventList().subscribe(
      success => {
        this.scheduledEventSource.next(success.sort(ScheduledEvent.compare));
      },
      error => { /* error */ },
      () => {} /* complete */
    );
  }
}
