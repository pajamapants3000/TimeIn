import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { Observable, of } from 'rxjs';

import { ScheduledEvent } from '../models/scheduled-event';
import { ScheduledEventService } from '../scheduled-event.service';

@Component({
  selector: 'app-scheduled-event-details',
  templateUrl: './scheduled-event-details.component.html',
  styleUrls: ['./scheduled-event-details.component.css']
})
export class ScheduledEventDetailsComponent implements OnInit, OnChanges {

  @Input() detailsId: number = null;
  @Input() isOpen: boolean;
  @Output() closeDetailsEvent = new EventEmitter<Boolean>();

  model: ScheduledEvent;

  constructor(private service: ScheduledEventService) { }

  ngOnInit() {
    console.log("ngOnInit called for scheduled-event-details component.");
    this.setModelData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges called for scheduled-event-details component.");
    if (changes["detailsId"] != undefined) {
      console.log("changes to detailsId detected in scheduled-event-details component.");
      this.setModelData();
    }
    if (changes["isOpen"] != undefined) {
      //console.log("changes to UpdateSwitch detected in scheduled-event-details component.");
      if (this.isOpen) {
        this.setModelData();
      }
    }
  }

  setModelData() {
    if (this.detailsId == null) {
      this.model = new ScheduledEvent({
        name: "",
        description: "",
        when: new Date(Date.now()),
        durationInMinutes: 60,
      });
    } else {
      this.service.getScheduledEvent(this.detailsId).subscribe(
        success => {
          this.model = success;
        },
        error => {},
        () => {}
      );
    }
  }

  setModelWhen(event: Date) {
    this.model.when = new Date(event);
  }

  closeDetails(isOk: boolean) {
    if (isOk) {
      if (this.model.when < ScheduledEvent.whenLowerLimit ||
          this.model.when > ScheduledEvent.whenUpperLimit) {
        console.log("Failed to save scheduled event - invalid data.");
        return;
      }

      if (this.detailsId == null) {
        this.service.addScheduledEvent(this.model)
          .subscribe(success => {
            this.closeDetailsEvent.emit(true);
          }, error => {
            console.log("Server returned error on attempt to add: " + error.toString());
          });
      } else {
        this.service.updateScheduledEvent(this.model)
          .subscribe(success => {
            this.closeDetailsEvent.emit(true);
          }, error => {
            console.log("Server returned error on attempt to update: " + error.toString());
          });
      }
    } else {
      this.closeDetailsEvent.emit(false);
    }
  }
}
