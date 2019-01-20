import {
  Component,
  SimpleChange,
  ComponentFactoryResolver,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('ScheduledEventDisplayComponent', () => {
  let component: ScheduledEventDisplayComponent;
  let fixture: ComponentFixture<ScheduledEventDisplayComponent>;
  let fakeList: ListComponentStub = new ListComponentStub();
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
        ListComponentStub
      ],
      providers: [
        { provide: IntracomService, useValue: spy_intracom },
        { provide: DisplayService, useValue: spy_display },
        { provide: ListComponentStub, useValue: fakeList },
      ],
    })

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onScheduledEventsUpdated on intracom when scheduledEvents$ gets new value',
     () => {
    let source = new Subject<ScheduledEvent[]>();
    component.scheduledEvents$ = source.asObservable();

    component.ngOnInit();
    fixture.detectChanges();

    let beforeCalls: number = intracomSpy.onScheduledEventsUpdated.calls.count();
    source.next(testData_empty);
    expect(intracomSpy.onScheduledEventsUpdated)
      .toHaveBeenCalledTimes(beforeCalls + 1);
  });
  it('should emit idSelected when intracom sends new idSelected',
     () => {
    let source = new Subject<number>();
    intracomSpy.getIdSelected$.and.returnValue(source.asObservable());

    component.ngOnInit();
    fixture.detectChanges();

    let arbitraryNumber: number = 2;
    let listenNumber: number = arbitraryNumber;
    component.idSelected.subscribe( success => { listenNumber = success; });

    source.next(arbitraryNumber + 1);
    fixture.detectChanges();

    expect(listenNumber).not.toEqual(arbitraryNumber);
  });
  it('should call loadComponent with index when currentDisplayKind receives new value',
     () => {
    spyOn(component, 'loadComponent');
    let initialKindValue: DisplayKind = DisplayKind.List;
    let newKindValue: DisplayKind = DisplayKind.Monthly;

    component.currentDisplayKind = DisplayKind.List;
    component.ngOnChanges({
      currentDisplayKind: new SimpleChange(DisplayKind.None, initialKindValue, true)
    });
    fixture.detectChanges();

    let beforeCalls = component.loadComponent.calls.count();
    component.currentDisplayKind = DisplayKind.Monthly;
    component.ngOnChanges({
      currentDisplayKind: new SimpleChange(initialKindValue, newKindValue, false)
    });
    fixture.detectChanges();

    expect(component.loadComponent).toHaveBeenCalledTimes(beforeCalls + 1);
  });
  it('should request component factory from display service when loadComponent is called',
     () => {
    component.loadComponent(DisplayKind.List);
    expect(displaySpy.getDisplayComponent).toHaveBeenCalledWith(DisplayKind.List);
  });
});
