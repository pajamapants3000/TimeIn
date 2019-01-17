import { Component, Input, Output, EventEmitter } from '@angular/core'
import { By } from '@angular/platform-browser'
import { Observable, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ScheduledEvent } from '../models/scheduled-event'
import { ScheduledEventService } from '../scheduled-event.service';
import {
  doArraysContainSameValues,
  click,
  storedUtcDateToDate
} from '../common';

import * as json from '../../../../testData.json';

@Component({selector: 'app-list', template: '<ng-content></ng-content>'})
class ListComponentStub {
  @Input() scheduledEvents$: Observable<ScheduledEvent[]>;
  @Output() idSelected = new EventEmitter<number>();
}
@Component({selector: 'app-scheduled-event-details', template: '<ng-content></ng-content>'})
class ScheduledEventDetailsStub {
  @Input() detailsId: number;
  @Input() detailsUpdateSwitch: number;
  @Output() closeDetailsEvent = new EventEmitter<boolean>();
}
@Component({selector: 'mat-sidenav', template:
           '<div *ngIf="opened">' +
           '<ng-content></ng-content>' +
           '</div>'
           })
class MatSideNavStub {
  @Input() public opened: boolean;
}

@Component({selector: 'mat-sidenav-container', template: '<ng-content></ng-content>' })
class MatSideNavContainerStub { }
@Component({selector: 'mat-sidenav-content', template: '<ng-content></ng-content>' })
class MatSideNavContentStub { }

import { ScheduledEventsComponent } from './scheduled-events.component'

describe('ScheduledEventsComponent', () => {
  let component: ScheduledEventsComponent;
  let fixture: ComponentFixture<ScheduledEventsComponent>;
  let fakelist: ListComponentStub = new ListComponentStub();
  let fakeDetails: ScheduledEventDetailsStub = new ScheduledEventDetailsStub();
  let fakeNav: MatSideNavStub = new MatSideNavStub();
  let eventServiceSpy: jasmine.SpyObj<ScheduledEventService>;

  let testData: ScheduledEvent[];
  let testData_empty: ScheduledEvent[];

  beforeEach(() => {
    let spy = jasmine.createSpyObj('ScheduledEventService', ['getScheduledEventList']);
    TestBed.configureTestingModule({
      declarations: [
        ScheduledEventsComponent,
        ListComponentStub,
        ScheduledEventDetailsStub,
        MatSideNavStub,
        MatSideNavContainerStub,
        MatSideNavContentStub
      ],
      providers: [
        { provide: ListComponentStub, useValue: fakelist },
        { provide: ScheduledEventDetailsStub, useValue: fakeDetails },
        { provide: MatSideNavStub, useValue: fakeNav },
        { provide: ScheduledEventService, useValue: spy },
      ]
    });

    testData = json.ScheduledEvent.map(i => {
      return new ScheduledEvent({
        id: i.id,
        description: i.description,
        name: i.name,
        when: storedUtcDateToDate(new Date(i.when)),
        durationInMinutes: i.durationInMinutes
      });
    });
    testData_empty = [];

    eventServiceSpy = TestBed.get(ScheduledEventService);
    eventServiceSpy.getScheduledEventList.and.returnValue(of(testData));

    fixture = TestBed.createComponent(ScheduledEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render ListComponent',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('app-list')).toBeTruthy();
  });
  it('should render ScheduledEventDetails component iff isDetailsOpen is true',
     () => {
    const element = fixture.debugElement.nativeElement;

    component.isDetailsOpen = false;
    fixture.detectChanges();
    expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();

    component.isDetailsOpen = true;
    fixture.detectChanges();
    expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();
  });
  it('should call `openDetails` when idSelected event is emitted',
     () => {
      const debugElement = fixture.debugElement;
      const arbitraryNumber: number = 2;
      const list = debugElement.query(By.directive(ListComponentStub))
        .componentInstance;
      spyOn(component, "openDetails");

      list.idSelected.emit(arbitraryNumber)
      expect(component.openDetails).toHaveBeenCalledWith(arbitraryNumber);
  });
  it('should open side nav when `openDetails` is called',
     () => {
      const arbitraryNumber: number = 2;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      expect(nav.opened).toBeFalsy();
      expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();

      component.openDetails(arbitraryNumber);
      fixture.detectChanges();

      expect(nav.opened).toBeTruthy();
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();
  });
  it('should open side nav when idSelected event is emitted',
     () => {
      const arbitraryNumber: number = 2;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const list = debugElement.query(By.directive(ListComponentStub))
        .componentInstance;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      expect(nav.opened).toBeFalsy();
      expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();

      list.idSelected.emit(arbitraryNumber)
      fixture.detectChanges();

      expect(nav.opened).toBeTruthy();
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();
  });
  it('should set ScheduledEventDetails detailsId input to correct id when ListComponent raises `idSelected` event',
     () => {
      const arbitraryNumber: number = 2;
      const debugElement = fixture.debugElement;
      const list = debugElement.query(By.directive(ListComponentStub))
        .componentInstance;

      list.idSelected.emit(arbitraryNumber);
      fixture.detectChanges();

      const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
        .componentInstance;
      expect(details.detailsId).toEqual(arbitraryNumber);
  });
  it('should close side nav when `closeDetailsEvent` event is triggered',
     () => {
      const arbitraryBoolean: boolean = false;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const list = debugElement.query(By.directive(ListComponentStub))
        .componentInstance;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      component.onAddClicked();
      fixture.detectChanges();

      expect(nav.opened).toEqual(true);
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();

      const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
        .componentInstance;

      details.closeDetailsEvent.emit(arbitraryBoolean);
      fixture.detectChanges();

      expect(nav.opened).toEqual(false);
      expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();
  });
  it('should call getScheduledEventList when `closeDetailsEvent` is true',
     () => {
    component.ngOnInit();
    fixture.detectChanges();
    let callsBefore: number = eventServiceSpy.getScheduledEventList.calls.count();

    const debugElement = fixture.debugElement;
    const element = debugElement.nativeElement;
    const list = debugElement.query(By.directive(ListComponentStub))
      .componentInstance;
    list.updateSwitch = false;
    const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

    component.onAddClicked();
    fixture.detectChanges();

    expect(nav.opened).toEqual(true);
    expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();

    const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
      .componentInstance;

    details.closeDetailsEvent.emit(true);
    fixture.detectChanges();

    expect(eventServiceSpy.getScheduledEventList)
      .toHaveBeenCalledTimes(callsBefore + 1);
  });
  it('should not call getScheduledEventList when `closeDetailsEvent` is false',
     () => {
    component.ngOnInit();
    fixture.detectChanges();
    let callsBefore: number = eventServiceSpy.getScheduledEventList.calls.count();

    const debugElement = fixture.debugElement;
    const element = debugElement.nativeElement;
    const list = debugElement.query(By.directive(ListComponentStub))
      .componentInstance;
    list.updateSwitch = false;
    const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

    component.onAddClicked();
    fixture.detectChanges();

    expect(nav.opened).toEqual(true);
    expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();

    const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
      .componentInstance;

    details.closeDetailsEvent.emit(false);
    fixture.detectChanges();

    expect(eventServiceSpy.getScheduledEventList)
      .toHaveBeenCalledTimes(callsBefore);
  });
  it('should call `getScheduledEventList` service method in ngOnInit',
     () => {
    let callsBefore: number = eventServiceSpy.getScheduledEventList.calls.count();
    component.ngOnInit();
    fixture.detectChanges();
    expect(eventServiceSpy.getScheduledEventList)
      .toHaveBeenCalledTimes(callsBefore + 1);
  });
  it('should render "Add new event" button',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('#addScheduledEventButton')).toBeTruthy();
  });
  it('should call onAddClicked when addScheduledEvent button clicked',
     () => {
    spyOn(component, "onAddClicked");
    const element = fixture.debugElement.nativeElement;
    const addButton = element.querySelector('#addScheduledEventButton');

    click(addButton);

    expect(component.onAddClicked).toHaveBeenCalled();
  });
  it('should set opened property of side nav to true when onAddClicked called',
     () => {
      const debugElement = fixture.debugElement;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      component.onAddClicked();
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const details = element.querySelector("app-scheduled-event-details");

      expect(nav.opened).toBeTruthy();
      expect(details).toBeTruthy();
  });
});
