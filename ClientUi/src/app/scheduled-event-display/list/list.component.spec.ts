import {
  Component,
  SimpleChange,
  SimpleChanges,
  Injectable,
} from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of, Subject, Observable } from 'rxjs';

import { ListComponent } from './list.component';
import { IntracomService } from '../intracom.service';
import {
  doArraysContainSameValues,
  click,
  storedUtcDateToDate
} from '../../common';
import { ScheduledEvent } from '../../models/scheduled-event';
import * as json from '../../../../../testData.json';

@Component({selector: 'mat-list', template: '<ng-content></ng-content>'})
class MatListStub {
}
@Component({selector: 'mat-list-item', template: '<ng-content></ng-content>'})
class MatListItemStub {
}

  const testYear: number = 1981;
  const testMonth: number = 11;
  const testDay: number = 6;
  const testHour: number = 8;
  const testMinute: number = 37;
  const testIsPm: boolean = false;
  const testDuration: number = 60;
  const testDateTime: Date = new Date(testYear, testMonth, testDay,
                     testHour + (testIsPm ? 12 : 0), testMinute);

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let intracomServiceSpy: jasmine.SpyObj<IntracomService>;

  let testData: ScheduledEvent[];
  let testData_empty: ScheduledEvent[];

  let intracomScheduledEventsSource: Subject<ScheduledEvent[]>;

  beforeEach(() => {
    intracomScheduledEventsSource = new Subject<ScheduledEvent[]>();
    let spy = jasmine.createSpyObj('IntracomServiceStub',
                                   [
      'getScheduledEvents$',
      'onIdSelected',
                                  ]);
    Object.defineProperty(spy, 'scheduledEventsSource', {
      value: intracomScheduledEventsSource,
      writable: false,
      get: () => { return intracomScheduledEventsSource; },
    });


    TestBed.configureTestingModule({
      declarations: [
        ListComponent,
        MatListStub,
        MatListItemStub,
      ],
      providers: [
        { provide: IntracomService, useValue: spy },
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

    intracomServiceSpy = TestBed.get(IntracomService);
    intracomServiceSpy.getScheduledEvents$.and
      .returnValue(intracomScheduledEventsSource.asObservable());

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    intracomScheduledEventsSource.next(testData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display list of scheduled events from test data, listed in order',
     () => {
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
  it('should render future events using scheduled-event-list-item-future css class',
     () => {
    let expectedCssClassName: string = "scheduled-event-list-item-future";

    let completeIds: string[] = testData.filter(i => i.when.getTime() > Date.now()).
      map(i => `scheduledEvent_${i.id}`);

    let eventListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list');
    expect(completeIds.length).toBeGreaterThan(0);
    for (let i = 0; i < completeIds.length; i++) {
      let completedItem = eventListElement.querySelector(`#${completeIds[i]}`);
      expect(completedItem.className).toEqual(expectedCssClassName);
    }
  });
  it('should render past events using scheduled-event-list-item-past css class',
     () => {
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
  it('should render with date, name, and "Details" button for each event',
     () => {
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
      expect(eventDetailsButton.textContent).toContain("Details");
    }
  });
  it('should call onIdSelected on intracom-service with correct id when "Details" clicked',
     async(() => {
    for (let eventId of testData.map(i => i.id)) {
      let elementId = `scheduledEvent_${eventId}`;
      let button: HTMLButtonElement = fixture.nativeElement
        .querySelector(`#${elementId}_details`);
      button.click();
      fixture.whenStable().then(() => {
        expect(intracomServiceSpy.onIdSelected).toHaveBeenCalledWith(eventId);
      });
    }
  }));
  it('should should update list when scheduledEvents subject receives new list',
     () => {
    let newScheduledEvent = new ScheduledEvent({
      id: testData.length + 1,
      name: "newScheduledEvent",
      description: "a new scheduled event",
      when: testDateTime,
      durationInMinutes: 15,
    });

    let newTestData: ScheduledEvent[] = [ ...testData, newScheduledEvent ];
    intracomScheduledEventsSource.next(newTestData);
    fixture.detectChanges();

    let eventListElement: HTMLElement = fixture.nativeElement.querySelector('mat-list')
    let listItems = eventListElement.querySelectorAll('mat-list-item div');
    let listValues: string[] = [];

    expect(listItems.length).toBeGreaterThan(0);
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].id)
    }

    let eventExpectedIds = newTestData.sort(ScheduledEvent.compare)
                                         .map(event => `scheduledEvent_${event.id}`);

    expect(doArraysContainSameValues(eventExpectedIds, listValues))
      .toBeTruthy();
  });

  it('should unsubscribe from scheduledEvents subscription in ngOnDestroy',
     () => {
       spyOn(component.subscription, 'unsubscribe');
       component.ngOnDestroy();

       expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
