import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';

import { ScheduledEvent } from '../../models/scheduled-event';
import { IntracomService } from '../intracom.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  @Input() scheduledEvents$: Observable<ScheduledEvent[]>;
  @Output() idSelected: EventEmitter<number> = new EventEmitter<number>();
  //public subscription: Subscription;

  constructor(/*private intracom: IntracomService*/) { }

  ngOnInit() {
    /*
    this.subscription = this.intracom.getScheduledEvents$().subscribe(
      success => {
        this.scheduledEvents$ = of(success.sort(ScheduledEvent.compare));
      }, error => {
        /* error /
      }, () => {
        /* complete /
      });
    */
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

  public onIdSelected(id: number): void {
    //this.intracom.onIdSelected(id);
    this.idSelected.emit(id);
  }

  public isPast(when: Date): boolean {
    if (when == null) return undefined;
    return (new Date(when.valueOf())).getTime() < Date.now();
  }
}
