import { Component, SimpleChange, } from '@angular/core';
import { By } from '@angular/platform-browser'
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';

import * as json from '../../../../../testData.json';

import { IntracomService } from '../intracom.service';
import { DisplayService } from '../display.service';

import { ScheduledEventDisplayComponent } from './scheduled-event-display.component';
import { ScheduledEvent } from '../../models/scheduled-event';
import { DisplayKind } from '../display-kind';
import { storedUtcDateToDate } from '../../common';

@Component({selector: 'app-list', template: '<ng-content></ng-content>' })
class ListComponentStub { }
@Component({selector: 'app-monthly-calendar', template: '<ng-content></ng-content>' })
class MonthlyCalendarComponentStub { }

describe('ScheduledEventDisplayComponent', () => {
  let component: ScheduledEventDisplayComponent;
  let fixture: ComponentFixture<ScheduledEventDisplayComponent>;
  let fakeList: ListComponentStub = new ListComponentStub();
  let fakeMonthlyCalendar: MonthlyCalendarComponentStub = new MonthlyCalendarComponentStub();
  let intracomSpy: jasmine.SpyObj<IntracomService>;
  let displaySpy: jasmine.SpyObj<DisplayService>;
  let scheduledEventsSource: Subject<ScheduledEvent[]>;
  let idSelectedSource: Subject<number>;

  let testData: ScheduledEvent[];
  let testData_empty: ScheduledEvent[];

  beforeEach(() => {
    scheduledEventsSource = new Subject<ScheduledEvent[]>();
    idSelectedSource = new Subject<number>();

    let spy_intracom = jasmine.createSpyObj('IntracomService', [
      'getIdSelected$',
      'onScheduledEventsUpdated',
    ]);
    let spy_display = jasmine.createSpyObj('DisplayService', [
      'getDisplayComponent',
    ]);

    TestBed.configureTestingModule({
      declarations: [
        ScheduledEventDisplayComponent,
        MonthlyCalendarComponentStub,
        ListComponentStub,
      ],
      providers: [
        { provide: IntracomService, useValue: spy_intracom },
        { provide: DisplayService, useValue: spy_display },
        { provide: ListComponentStub, useValue: fakeList },
        { provide: MonthlyCalendarComponentStub, useValue: fakeMonthlyCalendar },
      ],
    })

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ListComponentStub, MonthlyCalendarComponentStub]
      }
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

    intracomSpy = TestBed.get(IntracomService);
    intracomSpy.getIdSelected$.and.returnValue(idSelectedSource.asObservable());

    fixture = TestBed.createComponent(ScheduledEventDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    displaySpy = TestBed.get(DisplayService);
    // this should be returning a component factory; will a component work?
    displaySpy.getDisplayComponent.and.returnValue(null);
  });

  afterEach(() => {
    intracomSpy.getIdSelected$.calls.reset();
    intracomSpy.onScheduledEventsUpdated.calls.reset();
    displaySpy.getDisplayComponent.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onScheduledEventsUpdated on intracom when scheduledEvents$ gets new value',
     () => {
    let source = new Subject<ScheduledEvent[]>();
    component.scheduledEvents$ = source.asObservable();

    component.ngOnInit();
    fixture.detectChanges();

    source.next(testData_empty);
    expect(intracomSpy.onScheduledEventsUpdated)
      .toHaveBeenCalledWith(testData_empty);
  });
  it('should emit idSelected when intracom sends new idSelected',
     () => {
    component.ngOnInit();
    fixture.detectChanges();

    let arbitraryNumber: number = 2;
    let listenNumber: number = arbitraryNumber;
    component.idSelected.subscribe( success => { listenNumber = success; });

    idSelectedSource.next(arbitraryNumber + 1);
    fixture.detectChanges();

    expect(listenNumber).not.toEqual(arbitraryNumber);
  });
  it('should render component when currentDisplayKind receives new value',
     () => {
    // haven't figured out how to test the actual dynamic component rendering
    // so I encapsulated that step in a method - renderComponent
    displaySpy.getDisplayComponent.and.returnValue(ListComponentStub);
    spyOn(component, 'renderComponent');

    component.currentDisplayKind = DisplayKind.List;
    component.ngOnChanges({
      currentDisplayKind: new SimpleChange(DisplayKind.None, DisplayKind.List, true)
    });
    fixture.detectChanges();

    expect(component.renderComponent).toHaveBeenCalledWith(ListComponentStub);
  });
  it('should request component from display service when currentDisplayKind receives new value',
     () => {
    let initialKindValue: DisplayKind = DisplayKind.None;
    let newKindValue: DisplayKind = DisplayKind.Monthly;

    component.currentDisplayKind = newKindValue;
    component.ngOnChanges({
      currentDisplayKind: new SimpleChange(initialKindValue, newKindValue, false)
    });
    fixture.detectChanges();

    expect(displaySpy.getDisplayComponent).toHaveBeenCalledWith(newKindValue);
  });
});
