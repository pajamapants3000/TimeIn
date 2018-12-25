import { Component, SimpleChange, SimpleChanges  } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';

import { ListScheduledEventsComponent } from './list-scheduled-events.component';
import { ScheduledEventService } from '../scheduled-event.service';
import { doArraysContainSameValues, click } from '../common';
import { ScheduledEvent } from '../models/scheduled-event';
import * as json from '../../../../testData.json';

@Component({selector: 'mat-list', template: '<ng-content></ng-content>'})
class MatListStub {
}
@Component({selector: 'mat-list-item', template: '<ng-content></ng-content>'})
class MatListItemStub {
}

describe('ListScheduledEventsComponent', () => {
  let component: ListScheduledEventsComponent;
  let fixture: ComponentFixture<ListScheduledEventsComponent>;
  let eventServiceSpy: jasmine.SpyObj<ScheduledEventService>;

  let testData: ScheduledEvent[];
  let testData_empty: ScheduledEvent[];

  beforeEach(() => {
    let spy = jasmine.createSpyObj('ScheduledEventService', ['getScheduledEventList']);
    TestBed.configureTestingModule({
      declarations: [
        ListScheduledEventsComponent,
        MatListStub,
        MatListItemStub
      ],
      providers: [
        { provide: ScheduledEventService, useValue: spy }
      ]
    });

    testData = json.ScheduledEvent.map(
      (scheduledEvent: any) => {
        return (new ScheduledEvent()).deserialize(scheduledEvent)
    });
    testData_empty = [];

    eventServiceSpy = TestBed.get(ScheduledEventService);
    eventServiceSpy.getScheduledEventList.and.returnValue(of(testData));

    fixture = TestBed.createComponent(ListScheduledEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls `getListScheduledEvents` service method in ngOnInit',
     () => {
    let callsBefore: number = eventServiceSpy.getScheduledEventList.calls.count();
    component.ngOnInit();
    fixture.detectChanges();
    expect(eventServiceSpy.getScheduledEventList)
      .toHaveBeenCalledTimes(callsBefore + 1);
  });

  it('should display list of scheduled events from test data, listed in order',
     () => {
    component.ngOnInit();
    fixture.detectChanges();

    let eventListElement: HTMLElement = fixture.nativeElement.querySelector('mat-list')
    let listItems = eventListElement.querySelectorAll('mat-list-item div');
    let listValues: string[] = [];

    expect(listItems.length).toBeGreaterThan(0);
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].id)
    }
    let eventExpectedIds = testData.sort(ScheduledEvent.compare)
                                         .map(event => `scheduledEvent_${event.id}`);

    expect(doArraysContainSameValues(eventExpectedIds, listValues))
      .toBeTruthy();
  });

  it('should render "Add new event" button that calls openDetails with no argument',
     async(() => {
    component.ngOnInit();
    fixture.detectChanges();
    spyOn(component, 'openDetails');

    // first button on the screen will be the add button
    let button: HTMLElement = fixture.nativeElement.querySelector('button')
    button.click();
    fixture.whenStable().then(() => {
      expect(component.openDetails).toHaveBeenCalledWith();
    });
  }));

  it('should render future events using scheduled-event-list-item-future css class',
     () => {
    component.ngOnInit();
    fixture.detectChanges();

    let expectedCssClassName: string = "scheduled-event-list-item-future";

    let completeIds: string[] = testData.filter(i => i.when.getTime() > Date.now()).
      map(i => `scheduledEvent_${i.id}`);

    let eventListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    expect(completeIds.length).toBeGreaterThan(0);
    for (let i = 0; i < completeIds.length; i++) {
      let completedItem = eventListElement.querySelector(`#${completeIds[i]}`);
      expect(completedItem.className).toEqual(expectedCssClassName);
    }
  });

  it('should render past events using scheduled-event-list-item-past css class',
     () => {
    component.ngOnInit();
    fixture.detectChanges();

    let expectedCssClassName: string = "scheduled-event-list-item-past";

    let completeIds: string[] = testData.filter(i => i.when.getTime() <= Date.now()).
      map(i => `scheduledEvent_${i.id}`);

    let eventListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    expect(completeIds.length).toBeGreaterThan(0);
    for (let i = 0; i < completeIds.length; i++) {
      let completedItem = eventListElement.querySelector(`#${completeIds[i]}`);
      expect(completedItem.className).toEqual(expectedCssClassName);
    }
  });

  it('should render with date, name, and details button for each event',
     () => {
    component.ngOnInit();
    fixture.detectChanges();

    let eventIds: string[] = testData.map(i => `scheduledEvent_${i.id}`);

    let eventListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    expect(eventIds.length).toBeGreaterThan(0);
    for (let i = 0; i < eventIds.length; i++) {
      let eventItem = eventListElement.querySelector(`#${eventIds[i]}`);

      let eventDate = eventItem.querySelector(`#${eventIds[i]}_when`);
      let eventName = eventItem.querySelector(`#${eventIds[i]}_name`);
      let eventDetailsButton = eventItem.querySelector(`#${eventIds[i]}_details`);

      expect(eventDate).toBeTruthy();
      expect(eventName).toBeTruthy();
      expect(eventDetailsButton.tagName).toBe("button".toUpperCase());
    }
  });

  it('should call openDetails with correct id when "Details" clicked',
     async(() => {
    component.ngOnInit();
    fixture.detectChanges();
    spyOn(component, 'openDetails');

    for (let eventId of testData.map(i => i.id)) {
      let elementId = `scheduledEvent_${eventId}`;
      let button: HTMLButtonElement = fixture.nativeElement
        .querySelector(`#${elementId}_details`);
      button.click();
      fixture.whenStable().then(() => {
        expect(component.openDetails).toHaveBeenCalledWith(eventId);
      });
    }
  }));

  it('should call `getScheduledEventList` service method when `isUpdateAvailable` changed to true',
     () => {
    component.ngOnInit();
    fixture.detectChanges();

    let changes: SimpleChanges = {};
    changes["isUpdateAvailable"] = new SimpleChange(false, true, false);

    eventServiceSpy.getScheduledEventList.calls.reset();
    component.ngOnChanges(changes);

    expect(eventServiceSpy.getScheduledEventList.calls.count()).toEqual(1);
  });

  it('should set `isUpdateAvailable` to false after `getScheduledEventList` called',
     () => {
    component.ngOnInit();
    fixture.detectChanges();

    component.isUpdateAvailable = true;
    let changes: SimpleChanges = {};
    changes["isUpdateAvailable"] = new SimpleChange(false, true, false);

    eventServiceSpy.getScheduledEventList.calls.reset;
    component.ngOnChanges(changes);

    expect(component.isUpdateAvailable).toBeFalsy();
  });
  it('should emit `openDetailsEvent` with no id when `openDetails` is called without id',
     (done) => {
       component.openDetailsEvent.subscribe(o => {
         expect(o).toBeNull()
         done();
       });
       component.openDetails();
  });
  it('should emit `openDetailsEvent` with correct id when `openDetails` is called with id',
     (done) => {
       const arbitraryNumber = 2;
       component.openDetailsEvent.subscribe(o => {
         expect(o).toEqual(arbitraryNumber);
         done();
       });
       component.openDetails(arbitraryNumber);
  });
});
