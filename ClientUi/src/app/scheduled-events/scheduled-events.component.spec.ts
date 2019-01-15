import { Component, Input, Output, EventEmitter } from '@angular/core'
import { By } from '@angular/platform-browser'

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ScheduledEvent } from '../models/scheduled-event'
import { click } from '../common';

@Component({selector: 'app-list-scheduled-events', template: '<ng-content></ng-content>'})
class ListScheduledEventsStub {
  @Input() updateSwitch: boolean;
  @Output() openDetailsEvent = new EventEmitter<number>();
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
  it('should set ScheduledEventDetails detailsId input to correct id when ListScheduledEvents raises `openDetailsEvent` event',
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
  it('should toggle ListScheduledEvents `updateSwitch` input when `closeDetailsEvent` is true',
     () => {
      const arbitraryBoolean: boolean = false;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;
      list.updateSwitch = false;
      const initialSwitchValue: boolean = list.updateSwitch;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      list.openDetailsEvent.emit()
      fixture.detectChanges();

      expect(nav.opened).toEqual(true);
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();

      const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
        .componentInstance;

      let testEvent: ScheduledEvent = new ScheduledEvent({
        id: 99,
        name: "test",
        description: "test",
        when: new Date(),
        durationInMinutes: 0
      });
      details.closeDetailsEvent.emit(testEvent);
      fixture.detectChanges();

      expect(list.updateSwitch).toEqual(!initialSwitchValue);
  });
  it('should not toggle ListScheduledEvents `updateSwitch` input when `closeDetailsEvent` is false',
     () => {
      const arbitraryBoolean: boolean = false;
      const debugElement = fixture.debugElement;
      const element = debugElement.nativeElement;
      const list = debugElement.query(By.directive(ListScheduledEventsStub))
        .componentInstance;
      list.updateSwitch = false;
      const initialSwitchValue: boolean = list.updateSwitch;
      const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

      list.openDetailsEvent.emit()
      fixture.detectChanges();

      expect(nav.opened).toEqual(true);
      expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();

      const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
        .componentInstance;

      details.closeDetailsEvent.emit(null);
      fixture.detectChanges();

      expect(list.updateSwitch).toEqual(initialSwitchValue);
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
