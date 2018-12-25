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
  @Output() closeDetailsEvent = new EventEmitter<ScheduledEvent>();

  model: ScheduledEvent;

  currentDateTime: Date = new Date(Date.now());

  constructor(private service: ScheduledEventService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["detailsId"] != undefined) {
      if (this.detailsId != null) {
        this.service.getScheduledEvent(this.detailsId).subscribe(
          success => this.model = success,
          error => {},
          () => {}
        )
      }
    }
  }

  ngOnInit() {
    if (this.detailsId == null) {
      this.model = new ScheduledEvent({
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

  closeDetails(isOk: boolean) {
    if (isOk) {
      this.closeDetailsEvent.emit(this.model);
    } else {
      this.closeDetailsEvent.emit(null);
    }
  }

  setModelWhen(value: Date) {
    console.log(`old value: ${this.model.when.toString()}`);
    console.log(`test value: ${value}`);
    this.model.when = value;
    console.log(`model value: ${this.model.when.toString()}`);
  }
}
