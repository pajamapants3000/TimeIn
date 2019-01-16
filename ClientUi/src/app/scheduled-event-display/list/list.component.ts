import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';

import { ScheduledEvent } from '../../models/scheduled-event';
import { IntracomService } from '../intracom.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  public scheduledEvents$: Observable<ScheduledEvent[]>;
  public subscription: Subscription;

  constructor(private intracom: IntracomService) { }

  ngOnInit() {
    this.subscription = this.intracom.getScheduledEvents$().subscribe(
      success => {
        this.scheduledEvents$ = of(success.sort(ScheduledEvent.compare));
      }, error => {
        /* error */
      }, () => {
        /* complete */
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onIdSelected(id: number): void {
    this.intracom.onIdSelected(id);
  }

  public isPast(when: Date): boolean {
    if (when == null) return undefined;
    return (new Date(when.valueOf())).getTime() < Date.now();
  }
}
