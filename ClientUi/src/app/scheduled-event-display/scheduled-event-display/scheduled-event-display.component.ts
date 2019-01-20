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

import { Observable, of } from 'rxjs';

import { IntracomService } from '../intracom.service';
import { DisplayService } from '../display.service';
import { DisplayKind } from '../display-kind';
import { ListComponent } from '../list/list.component';
import { ScheduledEvent } from '../../models/scheduled-event';

@Component({
  selector: 'app-scheduled-event-display',
  templateUrl: './scheduled-event-display.component.html',
  styleUrls: ['./scheduled-event-display.component.css']
})
export class ScheduledEventDisplayComponent implements OnInit, OnChanges {


  @Output() idSelected: EventEmitter<number> = new EventEmitter<number>();
  @Input() currentDisplayKind: DisplayKind = DisplayKind.None;
  @Input() scheduledEvents$: Observable<ScheduledEvent[]> =
    new Observable<ScheduledEvent[]>();

  constructor(public viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private intracomService: IntracomService,
              private displayService: DisplayService) {
  }

  ngOnInit() {
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
    for (let propName in changes) {
      switch (propName) {
        case "currentDisplayKind":
          this.loadComponent(this.currentDisplayKind);
          break;
      }
    }
  }

  loadComponent(kind: DisplayKind) {
    this.viewContainerRef.clear();

    let componentFactory = this.displayService.getDisplayComponent(kind);
    if (componentFactory !== null) {
      this.viewContainerRef.createComponent(
        this.componentFactoryResolver
          .resolveComponentFactory(componentFactory));
    }
  }
}
