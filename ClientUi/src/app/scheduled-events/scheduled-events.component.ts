import { Component } from '@angular/core';
import { ScheduledEvent } from '../models/scheduled-event';

@Component({
  selector: 'app-scheduled-events',
  templateUrl: './scheduled-events.component.html',
  styleUrls: ['./scheduled-events.component.css']
})
export class ScheduledEventsComponent {

  constructor() { }

  isDetailsOpen: boolean = false;
  detailsId: number = null;
  isUpdated: boolean;

  onOpenDetails(id?: number) {
    if (id == null) {
      this.detailsId = null;
    } else {
      this.detailsId = id;
    }

    this.isDetailsOpen = true;
  }

  onCloseDetails(model: ScheduledEvent) {
    if (model == null) {
      this.isUpdated = false;
    } else {
      this.isUpdated = true;
    }

    this.isDetailsOpen = false;
  }
}
