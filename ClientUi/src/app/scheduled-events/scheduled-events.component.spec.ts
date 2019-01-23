import { Component, Input, Output, EventEmitter } from '@angular/core'
import { By } from '@angular/platform-browser'
import { Observable, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ScheduledEvent } from '../models/scheduled-event'
import { ScheduledEventService } from '../scheduled-event.service';
import {
  click,
  storedUtcDateToDate,
  msPerDay,
} from '../common';
import { DisplayKind } from '../scheduled-event-display/display-kind';
import { ScheduledEventsComponent } from './scheduled-events.component'

import * as json from '../../../../testData.json';

@Component({selector: 'app-scheduled-event-display', template: '<ng-content></ng-content>'})
class ScheduledEventDisplayComponentStub {
  @Input() scheduledEvents$: Observable<ScheduledEvent[]>;
  @Input() currentDisplayKind: DisplayKind;
  @Output() idSelected = new EventEmitter<number>();
}
@Component({selector: 'app-scheduled-event-details', template: '<ng-content></ng-content>'})
class ScheduledEventDetailsStub {
  @Input() detailsId: number;
  @Input() isOpen: boolean;
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

@Component({selector: 'mat-button-toggle-group', template: '<ng-content></ng-content>' })
class MatButtonToggleGroupStub {
  @Input() value: any;
}
@Component({selector: 'mat-button-toggle', template: '<ng-content></ng-content>' })
class MatButtonToggleStub {
  @Input() value: any;
}

describe('ScheduledEventsComponent', () => {
  let component: ScheduledEventsComponent;
  let fixture: ComponentFixture<ScheduledEventsComponent>;
  let fakelist: ScheduledEventDisplayComponentStub = new ScheduledEventDisplayComponentStub();
  let fakeDetails: ScheduledEventDetailsStub = new ScheduledEventDetailsStub();
  let fakeNav: MatSideNavStub = new MatSideNavStub();
  let eventServiceSpy: jasmine.SpyObj<ScheduledEventService>;

  let testData: ScheduledEvent[];

  beforeEach(() => {
    let _eventServicespy = jasmine.createSpyObj('ScheduledEventService', ['getScheduledEventList']);
    TestBed.configureTestingModule({
      declarations: [
        ScheduledEventsComponent,
        ScheduledEventDisplayComponentStub,
        ScheduledEventDetailsStub,
        MatSideNavStub,
        MatSideNavContainerStub,
        MatSideNavContentStub,
        MatButtonToggleGroupStub,
        MatButtonToggleStub,
      ],
      providers: [
        { provide: ScheduledEventDisplayComponentStub, useValue: fakelist },
        { provide: ScheduledEventDetailsStub, useValue: fakeDetails },
        { provide: MatSideNavStub, useValue: fakeNav },
        { provide: ScheduledEventService, useValue: _eventServicespy },
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

    eventServiceSpy = TestBed.get(ScheduledEventService);
    eventServiceSpy.getScheduledEventList.and.returnValue(of(testData));

    fixture = TestBed.createComponent(ScheduledEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render ScheduledEventDisplayComponent',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('app-scheduled-event-display')).toBeTruthy();
  });
  it('should render ScheduledEventDetails component iff sidenav is open',
     () => {
    const element = fixture.debugElement.nativeElement;
    const debugElement = fixture.debugElement;
    const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

    nav.opened = false;
    fixture.detectChanges();
    expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();

    nav.opened = true;
    fixture.detectChanges();
    expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();

    nav.opened = false;
    fixture.detectChanges();
    expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();
  });
  it('should open side nav when idSelected event is emitted by display',
     () => {
    const arbitraryNumber: number = 2;
    const debugElement = fixture.debugElement;
    const element = debugElement.nativeElement;
    const list = debugElement.query(By.directive(ScheduledEventDisplayComponentStub))
      .componentInstance;
    const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

    expect(nav.opened).toBeFalsy();
    expect(element.querySelector('app-scheduled-event-details')).toBeFalsy();

    list.idSelected.emit(arbitraryNumber)
    fixture.detectChanges();

    expect(nav.opened).toBeTruthy();
    expect(element.querySelector('app-scheduled-event-details')).toBeTruthy();
  });
  it('should set ScheduledEventDetails detailsId input to correct id when ScheduledEventDisplayComponent emits `idSelected` event',
     () => {
    const arbitraryNumber: number = 2;
    const debugElement = fixture.debugElement;
    const list = debugElement.query(By.directive(ScheduledEventDisplayComponentStub))
      .componentInstance;

    list.idSelected.emit(arbitraryNumber);
    fixture.detectChanges();

    const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
      .componentInstance;
    expect(details.detailsId).toEqual(arbitraryNumber);
  });
  it('should set ScheduledEventDetails detailsId input to null when add button clicked',
     () => {
    const debugElement = fixture.debugElement;
    const element = debugElement.nativeElement;
    const addButton = element.querySelector('#addScheduledEventButton');

    click(addButton);
    fixture.detectChanges();

    const details = debugElement.query(By.directive(ScheduledEventDetailsStub))
      .componentInstance;
    expect(details.detailsId).toEqual(null);
  });
  it('should close side nav when `closeDetailsEvent` event is triggered',
     () => {
    const arbitraryBoolean: boolean = false;
    const debugElement = fixture.debugElement;
    const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;

    component.onAddClicked();
    fixture.detectChanges();

    let details = debugElement.query(By.directive(ScheduledEventDetailsStub));
    expect(nav.opened).toEqual(true);
    expect(details).toBeTruthy();

    details.componentInstance.closeDetailsEvent.emit(arbitraryBoolean);
    fixture.detectChanges();

    details = debugElement.query(By.directive(ScheduledEventDetailsStub));
    expect(nav.opened).toEqual(false);
    expect(details).toBeFalsy();
  });
  it('should initialize scheduledEvents$ in ngOnInit',
     (done) => {
    let arbitraryExistingId: number = 2;

    component.scheduledEvents$.subscribe(
      value => {
        expect(value.findIndex(x => x.id == arbitraryExistingId)).not.toEqual(-1);
        done();
    });

    component.ngOnInit();
    fixture.detectChanges();
  });
  it('should update scheduledEvents$ when `closeDetailsEvent` is true',
     (done) => {
    component.ngOnInit();
    fixture.detectChanges();

    component.onAddClicked();
    fixture.detectChanges();

    let newId: number = testData.length + 1;

    let newTestData = [...testData, new ScheduledEvent({
      id: newId,
      name: "test event",
      description: "another one",
      when: new Date(Date.now() - msPerDay),
      durationInMinutes: 55
    })];
    eventServiceSpy.getScheduledEventList.and.returnValue(of(newTestData));

    component.scheduledEvents$.subscribe(
      value => {
        expect(value.findIndex(x => x.id == newId)).not.toEqual(-1);
        done();
    });

    let details = fixture.debugElement.query(By.directive(ScheduledEventDetailsStub));
    details.componentInstance.closeDetailsEvent.emit(true);
    fixture.detectChanges();
  });
  it('should render "Add new event" button',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('#addScheduledEventButton')).toBeTruthy();
  });
  it('should open sidenav when addScheduledEvent button clicked',
     () => {
    const debugElement = fixture.debugElement;
    const addButton = debugElement.nativeElement.querySelector('#addScheduledEventButton');

    click(addButton);
    fixture.detectChanges();

    const nav = debugElement.query(By.directive(MatSideNavStub)).componentInstance;
    const details = debugElement.query(By.directive(ScheduledEventDetailsStub));
    expect(nav.opened).toBeTruthy();
    expect(details).toBeTruthy();
  });
  it('should render toggle button with options List and Monthly',
     () => {
    const element = fixture.debugElement.nativeElement;
    const toggleGroup = element.querySelector('#displayKind');
    expect(toggleGroup).toBeTruthy();
    const toggleButtons = toggleGroup.querySelectorAll('mat-button-toggle');
    expect(toggleButtons[0].innerText).toEqual("List");
    expect(toggleButtons[1].innerText).toEqual("Monthly");
  });
  it('should set currentDisplayKind input property to DisplayKind.List when onDisplayKindChanged called with "List"',
     () => {
    const debugElement = fixture.debugElement;
    component.onDisplayKindChanged("List");
    fixture.detectChanges();

    const display = debugElement.query(By.directive(ScheduledEventDisplayComponentStub))
      .componentInstance;
    expect(display.currentDisplayKind).toEqual(DisplayKind.List);
  });
  it('should set currentDisplayKind input property to DisplayKind.Monthly when onDisplayKindChanged called with "Monthly"',
     () => {
    const debugElement = fixture.debugElement;
    component.onDisplayKindChanged("Monthly");
    fixture.detectChanges();

    const display = debugElement.query(By.directive(ScheduledEventDisplayComponentStub))
      .componentInstance;
    expect(display.currentDisplayKind).toEqual(DisplayKind.Monthly);
  });
});

