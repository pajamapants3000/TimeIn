import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  OnChanges,
  SimpleChange,
} from '@angular/core';

import { Observable } from 'rxjs';

import { IntracomService } from '../intracom.service';
import { DisplayService } from '../display.service';
import { DisplayKind } from '../display-kind';
import { ScheduledEvent } from '../../models/scheduled-event';

@Component({
  selector: 'app-scheduled-event-display',
  templateUrl: './scheduled-event-display.component.html',
  styleUrls: ['./scheduled-event-display.component.css']
})
export class ScheduledEventDisplayComponent implements OnInit, OnChanges {


  @Output() idSelected: EventEmitter<number> = new EventEmitter<number>();
  @Input() currentDisplayKind: DisplayKind = DisplayKind.None;
  @Input() scheduledEvents$: Observable<ScheduledEvent[]> = new Observable<ScheduledEvent[]>();

  constructor(public viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private intracomService: IntracomService,
              private displayService: DisplayService) {
  }

  ngOnInit() {
    console.log("ngOnInit called for scheduled-event-display");
    this.intracomService.getIdSelected$().subscribe(
      id => {
        this.idSelected.emit(id);
      }, error => {
        /* error */
      }, () => {
        /* complete */
    });

    this.scheduledEvents$.subscribe(
      events => {
        this.intracomService.onScheduledEventsUpdated(events);
      }, error => {
        /* error */
      }, () => {
        /* complete */
      });
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.log("ngOnChanges called for scheduled-event-display");
    for (let propName in changes) {
      console.log(`ngOnChanges: ${propName}`);
      switch (propName) {
        case "currentDisplayKind":
          this.loadComponent(this.currentDisplayKind);
          break;
      }
    }
  }

  loadComponent(kind: DisplayKind) {
    this.viewContainerRef.clear();
    this.renderComponent(this.displayService.getDisplayComponent(kind));
  }

  renderComponent(componentFactory: any) {
    if (componentFactory !== null) {
      this.viewContainerRef.createComponent(
        this.componentFactoryResolver
          .resolveComponentFactory(componentFactory));
    }
  }
}
