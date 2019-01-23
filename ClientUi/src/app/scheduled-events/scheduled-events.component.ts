import {
  Component,
  OnInit,
  ViewChild,
  ContentChild,
} from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { MatSidenav } from '@angular/material';

import { ScheduledEvent } from '../models/scheduled-event';
import { ScheduledEventService } from '../scheduled-event.service';
import { ScheduledEventDetailsComponent } from
  '../scheduled-event-details/scheduled-event-details.component';
import { ScheduledEventDisplayComponent } from
  '../scheduled-event-display/scheduled-event-display/scheduled-event-display.component';
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
  // couldn't get @ViewChild to work with ScheduledEventDisplayComponent
  // my best guess is I'm not importing it correctly to be used this way
  // but all the documentation I've seen says it should work.
  @ViewChild('display')
  private display: ScheduledEventDisplayComponent;

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
    this.details.detailsId = null;
    this.sidenav.opened = true;
  }

  openDetails(id: number) {
    console.log(`Opening scheduled event details for id: ${id}`);
    this.details.detailsId = id;
    this.sidenav.opened = true;
  }

  closeDetails(_isUpdated: boolean) {
    console.log(`Closed scheduled event details.`);
    if (_isUpdated) {
      this.updateScheduledEvents();
    }

    this.sidenav.opened = false;
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
