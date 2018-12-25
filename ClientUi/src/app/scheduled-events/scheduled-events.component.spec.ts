import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduledEvent } from '../models/scheduled-event';

@Component({selector: 'app-list-scheduled-events', template: '<ng-content></ng-content>'})
class ListScheduledEventsStub {
  @Input() isUpdateAvailable: boolean;
  @Output() openDetailsEvent = new EventEmitter<number>();
}
@Component({selector: 'app-scheduled-event-details', template: '<ng-content></ng-content>'})
class ScheduledEventDetailsStub {
  @Input() detailsId: number;
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

import { ScheduledEventsComponent } from './scheduled-events.component';

describe('ScheduledEventsComponent', () => {
  let component: ScheduledEventsComponent;
  let fixture: ComponentFixture<ScheduledEventsComponent>;
  let fakelist: ListScheduledEventsStub = new ListScheduledEventsStub();
  let fakeDetails: ScheduledEventDetailsStub = new ScheduledEventDetailsStub();
  let fakeNav: MatSideNavStub = new MatSideNavStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScheduledEventsComponent,
        ListScheduledEventsStub,
        ScheduledEventDetailsStub,
        MatSideNavStub,
        MatSideNavContainerStub,
        MatSideNavContentStub
      ],
      providers: [
        { provide: ListScheduledEventsStub, useValue: fakelist },
        { provide: ScheduledEventDetailsStub, useValue: fakeDetails },
        { provide: MatSideNavStub, useValue: fakeNav }
      ]
    });

    fixture = TestBed.createComponent(ScheduledEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ListScheduledEvents component',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('app-list-scheduled-events')).toBeTruthy();
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
  it('should call `onOpenDetails` when openDetailsEvent event is emitted',
     () => {
      const debugElement = fixture.debugElement;
      const arbitraryNumber: number = 2;
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;
      spyOn(component, "onOpenDetails");

      list.openDetailsEvent.emit(arbitraryNumber)
      expect(component.onOpenDetails).toHaveBeenCalledWith(arbitraryNumber);
  });
  it('should open side nav when `onOpenDetails` is called',
     () => {
      const arbitraryNumber: number = 2;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      expect(nav.opened).toBeFalsy();
      expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();

      component.onOpenDetails(arbitraryNumber);
      fixture.detectChanges();

      expect(nav.opened).toBeTruthy();
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();
  });
  it('should open side nav when openDetailsEvent event is emitted',
     () => {
      const arbitraryNumber: number = 2;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      expect(nav.opened).toBeFalsy();
      expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();

      list.openDetailsEvent.emit(arbitraryNumber)
      fixture.detectChanges();

      expect(nav.opened).toBeTruthy();
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();
  });
  it('should set ScheduledEventDetails id input to null when ListScheduledEvents raises `openDetailsEvent` event with no id',
     () => {
      const arbitraryNumber: number = 2;
      const debugElement = fixture.debugElement;
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;

      list.openDetailsEvent.emit(arbitraryNumber);
      fixture.detectChanges();

      const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
        .componentInstance;
      expect(details.detailsId).toEqual(arbitraryNumber);

      list.openDetailsEvent.emit();
      fixture.detectChanges();

      expect(details.detailsId).toBeNull();
  });
  it('should set ScheduledEventDetails id input to correct id when ListScheduledEvents raises `openDetailsEvent` event',
     () => {
      const arbitraryNumber: number = 2;
      const debugElement = fixture.debugElement;
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;

      list.openDetailsEvent.emit(arbitraryNumber);
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
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      list.openDetailsEvent.emit()
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
  it('should set ListScheduledEvents `isUpdateAvailable` input to true when `closeDetailsEvent` is non-null',
     () => {
      const isDetailsUpdated: boolean = true;
      const arbitraryBoolean: boolean = false;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      list.openDetailsEvent.emit()
      fixture.detectChanges();

      expect(nav.opened).toEqual(true);
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();

      const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
        .componentInstance;

      let testEvent: ScheduledEvent = new ScheduledEvent({
        id: 5,
        name: "test",
        description: "test",
        when: new Date(),
        durationInMinutes: 0
      });
      details.closeDetailsEvent.emit(testEvent);
      fixture.detectChanges();

      expect(list.isUpdateAvailable).toEqual(isDetailsUpdated);
  });
  it('should set ListScheduledEvents `isUpdateAvailable` input to false when `closeDetailsEvent` is null',
     () => {
      const isDetailsUpdated: boolean = false;
      const arbitraryBoolean: boolean = false;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      list.openDetailsEvent.emit()
      fixture.detectChanges();

      expect(nav.opened).toEqual(true);
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();

      const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
        .componentInstance;

      details.closeDetailsEvent.emit(null);
      fixture.detectChanges();

      expect(list.isUpdateAvailable).toEqual(isDetailsUpdated);
  });
});
