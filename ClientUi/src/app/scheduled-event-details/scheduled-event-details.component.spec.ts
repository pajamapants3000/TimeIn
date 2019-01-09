import { Component, SimpleChanges, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ScheduledEventDetailsComponent } from './scheduled-event-details.component';
import { ScheduledEvent } from '../models/scheduled-event';
import { click, storedUtcDateToDate } from '../common';

import { ScheduledEventService } from '../scheduled-event.service';

import * as json from '../../../../testData.json';

@Component({selector: 'mat-form-field', template: '<ng-content></ng-content>'})
class MatFormFieldStub {
}

describe('ScheduledEventDetailsComponent', () => {
  let component: ScheduledEventDetailsComponent;
  let fixture: ComponentFixture<ScheduledEventDetailsComponent>;
  let eventServiceSpy: jasmine.SpyObj<ScheduledEventService>;

  let testData: ScheduledEvent[];
  let testData_empty: ScheduledEvent[];
  let testEvent: ScheduledEvent;
  const testId: number = 5;   // should be > largest testData id
  const testName: string = "Test scheduled event name";
  const testDescription: string = "Test scheduled event description";
  const testYear: number = 1981;
  const testMonth: number = 11;
  const testDay: number = 6;
  const testHour: number = 8;
  const testMinute: number = 37;
  const testIsPm: boolean = false;
  const testDuration: number = 60;
  const testDateTime: Date = new Date(testYear, testMonth, testDay,
                     testHour + (testIsPm ? 12 : 0), testMinute);

  beforeEach(() => {
    let spy = jasmine.createSpyObj('ScheduledEventService',
    [
      'getScheduledEvent',
      'addScheduledEvent',
      'updateScheduledEvent'
    ]);
    TestBed.configureTestingModule({
      declarations: [
        ScheduledEventDetailsComponent,
        MatFormFieldStub,
      ],
      providers: [
        { provide: ScheduledEventService, useValue: spy }
      ],
      imports: [
        FormsModule,
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
    testEvent = new ScheduledEvent({
      id: testId,
      name: testName,
      description: testDescription,
      when: testDateTime,
      durationInMinutes: testDuration,
    });

    eventServiceSpy = TestBed.get(ScheduledEventService);
    eventServiceSpy.addScheduledEvent.and.returnValue(of(testEvent));
    eventServiceSpy.getScheduledEvent.and.returnValue(of(testEvent));
    eventServiceSpy.updateScheduledEvent.and.returnValue(of());

    fixture = TestBed.createComponent(ScheduledEventDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render "Ok" button',
     () => {
       let element = fixture.nativeElement;
       let button = element.querySelector("#submitScheduledEventEditButton");
       expect(button).toBeTruthy();
       expect(button.textContent).toContain("Ok");
  });
  it('should render "Cancel" button',
     () => {
       let element = fixture.nativeElement;
       let button = element.querySelector("#cancelScheduledEventEditButton");
       expect(button).toBeTruthy();
       expect(button.textContent).toContain("Cancel");
  });
  it('should call `getScheduledEvent` service method with correct id when detailsId changed',
     () => {
      eventServiceSpy.getScheduledEvent.and.returnValue(of(testEvent));
      eventServiceSpy.getScheduledEvent.calls.reset();
      component.detailsId = testId;
      let changes: SimpleChanges = {};
      changes["detailsId"] = new SimpleChange(null, testId, false);
      component.ngOnChanges(changes);
      fixture.detectChanges();
      expect(eventServiceSpy.getScheduledEvent.calls.allArgs())
        .toContain([testId]);
  });
  it('should display correct event details for requested event',
     fakeAsync(() => {
      fixture.detectChanges();
      eventServiceSpy.getScheduledEvent.and.returnValue(of(testEvent));
      component.detailsId = testEvent.id;
      component.ngOnInit();
      fixture.detectChanges();
      tick();
      expect(JSON.stringify(component.model)).toEqual(JSON.stringify(testEvent));

      let debugElement = fixture.debugElement;
      let element = debugElement.nativeElement;
      let nameInput = element.querySelector("#nameInput");
      let descriptionInput = element.querySelector("#descriptionInput");
      let whenInput = element.querySelector("#whenInput");
      let durationInput = element.querySelector("#durationInput");
      fixture.detectChanges();
      tick();

      expect(nameInput.value).toBe(testName, "name");
      expect(descriptionInput.value).toBe(testDescription, "description");
      expect(new Date(whenInput.value)).toEqual(testDateTime, "when");
      expect(new Number(durationInput.value)).toEqual(testDuration, "duration");
  }));
  it('should emit closeDetailsEvent(true) when "Ok" clicked',
     () => {
      fixture.detectChanges();
      let debugElement = fixture.debugElement;
      let element = debugElement.nativeElement;
      let okButton = element.querySelector("#submitScheduledEventEditButton");

      component.closeDetailsEvent.subscribe(
        success => {
          expect(success).toBeTruthy();
        },
        error => fail('closeDetailsEvent call failed')
      );

      click(okButton);
   });
  it('should emit `closeDetailsEvent(false)` when "Cancel" clicked',
     () => {
      fixture.detectChanges();
      let debugElement = fixture.debugElement;
      let element = debugElement.nativeElement;
      let cancelButton = element.querySelector("#cancelScheduledEventEditButton");

      component.closeDetailsEvent.subscribe(
        success => {
          expect(success).toBeFalsy();
        },
        error => fail('closeDetailsEvent call failed')
      );

      click(cancelButton);
  });
  it('should call `addScheduledEvent` with model data when "Ok" clicked with null Id',
     () => {
      fixture.detectChanges();
      let debugElement = fixture.debugElement;
      let element = debugElement.nativeElement;
      let nameInput = element.querySelector("#nameInput");
      let descriptionInput = element.querySelector("#descriptionInput");
      let whenInput = element.querySelector("#whenInput");
      let durationInput = element.querySelector("#durationInput");
      let okButton = element.querySelector("#submitScheduledEventEditButton");

      component.detailsId = null;

      nameInput.value = testEvent.name;
      nameInput.dispatchEvent(new Event('input'));

      descriptionInput.value = testEvent.description;
      descriptionInput.dispatchEvent(new Event('input'));

      let whenDate = new Date(testEvent.when.valueOf());
      let whenString = `${whenDate.getFullYear()}-` +
        `${String(whenDate.getMonth()+1).padStart(2, '0')}-` +
        `${String(whenDate.getDate()).padStart(2, '0')}` +
        `T${String(whenDate.getHours()).padStart(2, '0')}:` +
        `${String(whenDate.getMinutes()).padStart(2, '0')}`;
      whenInput.value = whenString;
      whenInput.dispatchEvent(new Event('input'));

      durationInput.value = testEvent.durationInMinutes;
      durationInput.dispatchEvent(new Event('input'));

      let beforeCallsCount: number = eventServiceSpy.addScheduledEvent.calls.count();

      click(okButton);

      expect(eventServiceSpy.addScheduledEvent.calls.count())
        .toEqual(beforeCallsCount + 1);

      let callArgs = eventServiceSpy.addScheduledEvent.calls.allArgs()[0][0];
      expect(callArgs.name).toEqual(testEvent.name);
      expect(callArgs.description).toEqual(testEvent.description);
      expect(callArgs.when).toEqual(testEvent.when);
      expect(callArgs.durationInMinutes).toEqual(testEvent.durationInMinutes);
  });
  it('should call `updateScheduledEvent` with model data when "Ok" clicked with non-null id',
     () => {
      let testId = 99;
      fixture.detectChanges();
      let debugElement = fixture.debugElement;
      let element = debugElement.nativeElement;
      let nameInput = element.querySelector("#nameInput");
      let descriptionInput = element.querySelector("#descriptionInput");
      let whenInput = element.querySelector("#whenInput");
      let durationInput = element.querySelector("#durationInput");
      let okButton = element.querySelector("#submitScheduledEventEditButton");

      component.detailsId = testId;
      component.model.id = testId;

      nameInput.value = testEvent.name;
      nameInput.dispatchEvent(new Event('input'));

      descriptionInput.value = testEvent.description;
      descriptionInput.dispatchEvent(new Event('input'));

      let whenDate = new Date(testEvent.when.valueOf());
      let whenString = `${whenDate.getFullYear()}-` +
        `${String(whenDate.getMonth()+1).padStart(2, '0')}-` +
        `${String(whenDate.getDate()).padStart(2, '0')}` +
        `T${String(whenDate.getHours()).padStart(2, '0')}:` +
        `${String(whenDate.getMinutes()).padStart(2, '0')}`;
      whenInput.value = whenString;
      whenInput.dispatchEvent(new Event('input'));

      durationInput.value = testEvent.durationInMinutes;
      durationInput.dispatchEvent(new Event('input'));

      let beforeCallsCount: number = eventServiceSpy.updateScheduledEvent.calls.count();

      click(okButton);

      expect(eventServiceSpy.updateScheduledEvent.calls.count())
        .toEqual(beforeCallsCount + 1);

      let callArgs = eventServiceSpy.updateScheduledEvent.calls.allArgs()[0][0];
      expect(callArgs.id).toEqual(testId);
      expect(callArgs.name).toEqual(testEvent.name);
      expect(callArgs.description).toEqual(testEvent.description);
      expect(callArgs.when).toEqual(testEvent.when);
      expect(callArgs.durationInMinutes).toEqual(testEvent.durationInMinutes);
  });
  it('should call neither `addScheduledEvent` nor `updateScheduledEvent` when "Cancel" clicked',
     () => {
      let testId = 99;
      fixture.detectChanges();
      let element = fixture.nativeElement;
      let cancelButton = element.querySelector("#cancelScheduledEventEditButton");

      component.detailsId = testId;
      component.model.id = testId;

      let beforeCallsAddCount: number = eventServiceSpy.addScheduledEvent.calls.count();
      let beforeCallsUpdateCount: number = eventServiceSpy.updateScheduledEvent.calls.count();

      click(cancelButton);

      expect(eventServiceSpy.addScheduledEvent.calls.count())
        .toEqual(beforeCallsAddCount);
      expect(eventServiceSpy.updateScheduledEvent.calls.count())
        .toEqual(beforeCallsUpdateCount);
  });
});

