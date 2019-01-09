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
  detailsUpdateSwitch: boolean = false;
  updateSwitch: boolean = false;

  onOpenDetails(id?: number) {
    if (id == null) {
      console.log(`Opening dialog to add new scheduled event.`);
      if (this.detailsId == null) {
        this.detailsUpdateSwitch = !this.detailsUpdateSwitch;
      } else {
        this.detailsId = null;
      }
    } else {
      console.log(`Opening scheduled event details for id: ${id}`);
      if (this.detailsId == id) {
        this.detailsUpdateSwitch = !this.detailsUpdateSwitch;
      } else {
        this.detailsId = id;
      }
    }

    this.isDetailsOpen = true;
  }

  onCloseDetails(_isUpdated: boolean) {
    console.log(`Closed scheduled event details.`);
    if (_isUpdated) {
      this.updateSwitch = !this.updateSwitch;
    }

    this.isDetailsOpen = false;
  }
}
