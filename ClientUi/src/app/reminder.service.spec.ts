import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ReminderService } from './reminder.service';
import { REMINDERS } from './mock-reminders'
import { REMINDERS_EMPTY } from './mock-reminders-empty'
import { remindersUrl, doArraysContainSameValues } from './common'
import { Reminder } from './reminder';

describe('ReminderService', () => {
  let reminderService: ReminderService;
  let dataServiceSpy: jasmine.SpyObj<HttpClient>;

  const testReminder: Reminder = { value: "reminder to add" } as Reminder;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: spy }]
    })
  });

  it('should be created', () => {
    reminderService = TestBed.get(ReminderService);

    expect(reminderService).toBeTruthy();
  });

  it('#addReminder should call POST api with argument',
     () => {
      reminderService = TestBed.get(ReminderService);
      dataServiceSpy = TestBed.get(HttpClient);

      reminderService.addReminder(testReminder.value);

      expect(dataServiceSpy.post).toHaveBeenCalledWith(remindersUrl,
                                                       testReminder,
                                                       reminderService.httpOptions);
     }
  );

  it('#addReminder should return success response when API call is successful',
     () => {
      reminderService = TestBed.get(ReminderService);
      dataServiceSpy = TestBed.get(HttpClient);
      dataServiceSpy.post.and.returnValue(of(testReminder));

      reminderService.addReminder(testReminder.value).subscribe(
        success => {/* success! */},
        error => fail('expected successful call'));
   });

  it('#addReminder should return error response when API call is not successful',
     () => {
      reminderService = TestBed.get(ReminderService);
      dataServiceSpy = TestBed.get(HttpClient);
      dataServiceSpy.post.and.returnValue(throwError('received error from server'));

      reminderService.addReminder(testReminder.value).subscribe(
        success => fail('expected failure'),
        error => {/* expected failure */}
      );
  });

  it('#listReminders should call GET api',
     () => {
      reminderService = TestBed.get(ReminderService);
      dataServiceSpy = TestBed.get(HttpClient);
      dataServiceSpy.get.and.returnValue(of(REMINDERS_EMPTY));

      reminderService.listReminders();

      expect(dataServiceSpy.get).toHaveBeenCalledWith(remindersUrl);
     }
  );

  it('#listReminders should return empty array when API returns empty array',
     () => {
      reminderService = TestBed.get(ReminderService);
      dataServiceSpy = TestBed.get(HttpClient);
      let expectedResult: string[] = REMINDERS_EMPTY;
      dataServiceSpy.get.and.returnValue(of(expectedResult));

      let resultToTest: string[];
      reminderService.listReminders().subscribe(
        success => resultToTest = success,
        error => fail('expected successful call'));

      expect(resultToTest).toBeTruthy();
      expect(doArraysContainSameValues(expectedResult, resultToTest))
        .toBeTruthy();
   });

  it('#listReminders should return list of reminders when API returns list',
     (): void => {
      reminderService = TestBed.get(ReminderService);
      dataServiceSpy = TestBed.get(HttpClient);
      let expectedResult: string[] = REMINDERS.map((reminder) => reminder.value);
      dataServiceSpy.get.and.returnValue(of(REMINDERS));

      let resultToTest: string[];
      reminderService.listReminders().subscribe(
        success => resultToTest = success,
        error => fail('expected successful call'));

      expect(resultToTest).toBeTruthy();
      expect(doArraysContainSameValues(expectedResult, resultToTest))
        .toBeTruthy();
   });

  it('#listReminders should return error response when API call is not successful',
     () => {
      reminderService = TestBed.get(ReminderService);
      dataServiceSpy = TestBed.get(HttpClient);
      dataServiceSpy.get.and.returnValue(throwError('received error from server'));

      reminderService.listReminders().subscribe(
        success => fail('expected failure'),
        error => {/* expected failure */}
      );
  });
});

