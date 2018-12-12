import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ReminderService } from './reminder.service';
import { reminderTestUrl, doArraysContainSameValues } from './common'
import { Reminder } from './reminder';
import * as json from '../../../testData.json';

describe('ReminderService', () => {
  let reminderService: ReminderService;
  let dataServiceSpy: jasmine.SpyObj<HttpClient>;
  let testData: Reminder[] = json.Reminder.map(i => {
    return { id: i.id, value: i.value }
  });
  let testData_empty: Reminder[] = [];

  const testReminder: Reminder = { value: "reminder to add" } as Reminder;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: spy }]
    })
    reminderService = TestBed.get(ReminderService);
    reminderService.apiUrl = reminderTestUrl;
    dataServiceSpy = TestBed.get(HttpClient);
    dataServiceSpy.post.and.returnValue(of(testReminder));
    dataServiceSpy.get.and.returnValue(of(testData_empty));
  });

  it('should be created', () => {
    expect(reminderService).toBeTruthy();
  });

  it('#addReminder should call POST api with argument',
     () => {
      reminderService.addReminder(testReminder);

      expect(dataServiceSpy.post).toHaveBeenCalledWith(reminderTestUrl,
                                                       testReminder,
                                                       reminderService.httpOptions);
     }
  );

  it('#addReminder should return new Reminder API call is successful',
     () => {
      reminderService.addReminder(testReminder).subscribe(
        success => {
          expect(success).toBeTruthy();
          expect(success.value).toEqual(testReminder.value);
        },
        error => fail('expected successful call'));
   });

  it('#addReminder should return error response when API call is not successful',
     () => {
      dataServiceSpy.post.and.returnValue(throwError('received error from server'));

      reminderService.addReminder(testReminder).subscribe(
        success => fail('expected failure'),
        error => {/* expected failure */}
      );
  });

  it('#addReminder should trigger update for any subscribers to reminders',
     () => {
      dataServiceSpy.get.and.returnValue(of([testReminder]));

      let reminderSubscriber: Reminder[] = [];
      reminderService.reminders.subscribe(
        success => reminderSubscriber = success,
        error => fail('expected successful call')
      );

      reminderService.addReminder(testReminder).subscribe(
        success => {
          expect(reminderSubscriber.length).toEqual(1);
        },
        error => fail('expected successful call')
      );
  });

  it('#updateReminders should call GET api',
     () => {
      reminderService.updateReminders();

      expect(dataServiceSpy.get).toHaveBeenCalledWith(reminderTestUrl);
     }
  );

  it('updateReminders` should trigger update for any subscribers to reminders',
     () => {
      dataServiceSpy.get.and.returnValue(of(testData));

      let reminderSubscriber: Reminder[] = testData_empty;
      reminderService.reminders.subscribe(
        success => reminderSubscriber = success,
        error => fail('expected successful call')
      );

      reminderService.updateReminders();
      expect(reminderSubscriber.length).toEqual(testData.length);
   });

  it('#updateReminders should leave reminders with updated value - empty ',
     () => {
      dataServiceSpy.get.and.returnValue(of(testData_empty));

      let reminderSubscriber: Reminder[] = testData;
      reminderService.reminders.subscribe(
        success => reminderSubscriber = success,
        error => fail('expected successful call')
      );

      reminderService.updateReminders();

      expect(doArraysContainSameValues(testData_empty, reminderSubscriber))
        .toBeTruthy();
   });

  it('#updateReminders should leave reminders with updated value - non-empty ',
     () => {
      dataServiceSpy.get.and.returnValue(of(testData));

      let reminderSubscriber: Reminder[] = [];
      reminderService.reminders.subscribe(
        success => reminderSubscriber = success,
        error => fail('expected successful call')
      );

      reminderService.updateReminders();

      expect(doArraysContainSameValues(testData, reminderSubscriber))
        .toBeTruthy();
   });

  it('#updateReminders should return error response when API call is not successful',
     () => {
      dataServiceSpy.get.and.returnValue(throwError('received error from server'));

      let reminders$: Observable<Reminder[]> = reminderService.reminders
      reminderService.updateReminders();

      reminders$.subscribe(
        success => fail('expected failure'),
        error => {/* expected failure */}
      )
  });

  it('#`updateReminders` should not update Reminders subject when API call is not successful',
     () => {
      dataServiceSpy.get.and.returnValue(throwError('received error from server'));

      let reminderSubscriber: Reminder[] = testData;
      reminderService.reminders.subscribe(
        success => reminderSubscriber = success,
        error => fail('expected successful call')
      );

      reminderService.updateReminders();

      expect(doArraysContainSameValues(reminderSubscriber, testData)).toBeTruthy();
   });
});

