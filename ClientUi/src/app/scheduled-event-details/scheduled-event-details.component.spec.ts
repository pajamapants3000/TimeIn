import { Component, SimpleChanges, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ScheduledEventDetailsComponent } from './scheduled-event-details.component';
import { ScheduledEvent } from '../models/scheduled-event';
import { click } from '../common';

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
  const testSecond: number = 44;
  const testIsPm: boolean = false;
  const testDuration: number = 60;
  const testDateTime: Date = new Date(testYear, testMonth, testDay,
                     testHour + (testIsPm ? 12 : 0), testMinute, testSecond);

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

    testData = json.ScheduledEvent.map(
      (scheduledEvent: any) => {
        return (new ScheduledEvent()).deserialize(scheduledEvent)
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

    fixture = TestBed.createComponent(ScheduledEventDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render "Ok" button',
     () => {
       let element = fixture.nativeElement;
       let button = element.querySelector("#ok");
       expect(button).toBeTruthy();
       expect(button.textContent).toContain("Ok");
  });
  it('should render "Cancel" button',
     () => {
       let element = fixture.nativeElement;
       let button = element.querySelector("#cancel");
       expect(button).toBeTruthy();
       expect(button.textContent).toContain("Cancel");
  });
  it('should call `getScheduledEvent` service method with correct id when id changed',
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
  it('should emit closeDetailsEvent with model data when "Ok" clicked',
     fakeAsync(() => {
      fixture.detectChanges();
      let debugElement = fixture.debugElement;
      let element = debugElement.nativeElement;
      let whenInput = element.querySelector("#whenInput");

      let whenDate = new Date(testEvent.when.valueOf());
      let whenString = `${whenDate.getFullYear()}-` +
        `${String(whenDate.getMonth()).padStart(2, '0')}-` +
        `${String(whenDate.getDate()).padStart(2, '0')}` +
        `T${String(whenDate.getHours()).padStart(2, '0')}:` +
        `${String(whenDate.getMinutes()).padStart(2, '0')}:` +
        `${String(whenDate.getSeconds()).padStart(2, '0')}`;
      whenString = "1989-07-08T11:37:13";
      whenInput.value = whenString;
      expect(whenInput.value).toEqual(whenString + "test");
      tick();
      expect(whenInput.value).toEqual(whenString + "test");
      fixture.detectChanges();
      expect(whenInput.value).toEqual(whenString + "test");
      whenInput.dispatchEvent(new Event('input'));
      //component.model.when = testEvent.when;

      expect(whenInput.value).toEqual(whenString);
  }));
  /*
  it('should emit closeDetailsEvent with model data when "Ok" clicked',
     fakeAsync(() => {
      fixture.detectChanges();
      let debugElement = fixture.debugElement;
      let element = debugElement.nativeElement;
      let nameInput = element.querySelector("#nameInput");
      nameInput.value = testEvent.name;
      nameInput.dispatchEvent(new Event('input'));
      //component.model.name = testEvent.name;
      let descriptionInput = element.querySelector("#descriptionInput");
      descriptionInput.value = testEvent.description;
      descriptionInput.dispatchEvent(new Event('input'));
      //component.model.description = testEvent.description;

      let whenInput = element.querySelector("#whenInput");
      let whenDate = new Date(testEvent.when.valueOf());
      let whenString = `${whenDate.getFullYear()}-` +
        `${String(whenDate.getMonth()).padStart(2, '0')}-` +
        `${String(whenDate.getDate()).padStart(2, '0')}` +
        `T${String(whenDate.getHours()).padStart(2, '0')}:` +
        `${String(whenDate.getMinutes()).padStart(2, '0')}:` +
        `${String(whenDate.getSeconds()).padStart(2, '0')}`;
      whenString = "1989-07-08T11:37:13";
      whenInput.value = whenString;
      fixture.detectChanges();
      tick();
      whenInput.dispatchEvent(new Event('input'));
      //component.model.when = testEvent.when;

      let durationInput = element.querySelector("#durationInput");
      durationInput.value = testEvent.durationInMinutes;
      durationInput.dispatchEvent(new Event('input'));
      //component.model.durationInMinutes = testEvent.durationInMinutes;
      fixture.detectChanges();
      tick();

      let okButton = element.querySelector("#ok");

      component.closeDetailsEvent.subscribe(
        success => {
          expect(success.name).toEqual(testEvent.name);
          expect(success.description).toEqual(testEvent.description);
          expect(new Date(whenInput.value)).toEqual(testEvent.when);
          expect(success.when).toEqual(testEvent.when);
          expect(success.durationInMinutes).toEqual(testEvent.durationInMinutes);
        },
        error => fail('closeDetailsEvent call failed')
      );
      click(okButton);
      fixture.detectChanges();
      tick();
   }));
   */
});

