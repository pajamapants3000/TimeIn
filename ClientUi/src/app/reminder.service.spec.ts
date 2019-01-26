import { TestBed, inject } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ReminderService } from './reminder.service';
import { doArraysContainSameValues, apiUrl } from './common'
import { Reminder } from './models/reminder';
import * as json from '../../../testData.json';

describe('ReminderService', () => {
  let testData: Reminder[] = json.Reminder.map(i => {
    return new Reminder().deserialize(i);
  });
  let testData_empty: Reminder[] = [];

  const testReminder: Reminder = new Reminder({
    value: "reminder to add",
    isCompleted: true
  });
  const errorEvent: ErrorEvent = new ErrorEvent('Network error', {
    message: 'Network error'
  });


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReminderService],
      imports: [HttpClientTestingModule],
    })
  });

  it('#addReminder should call POST api with argument',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {

      service.addReminder(testReminder).subscribe(
        success => { /* Success! */ },
        error => fail('expected successful call')
      );

      const reqPost = httpMock.expectOne(`${apiUrl}/reminder`);
      expect(reqPost.request.method).toEqual("POST");
      expect(reqPost.request.body).toEqual(testReminder);
      reqPost.flush(testReminder);
    })
  );



  it('#addReminder should return success result if API call is successful',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
      service.addReminder(testReminder).subscribe(
        success => {
          expect(success.value).toEqual(testReminder.value);
          expect(success.isCompleted).toEqual(testReminder.isCompleted);
        },
        error => fail('expected successful call')
      );

      const req = httpMock.match(`${apiUrl}/reminder`)[0];
      expect(req).toBeTruthy();

      req.flush(testReminder);
   }));

  it('#addReminder should return error response when API call is not successful',
    inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
    service.addReminder(testReminder).subscribe(
      success => fail('expected failure'),
      error => {/* expected failure */}
    );

    const req = httpMock.match(`${apiUrl}/reminder`)[0];
    expect(req).toBeTruthy();

    req.error(errorEvent);
  }));

  it('#addReminder should trigger update for any subscribers to reminderSource',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {

    let reqGet: TestRequest;
    let reminderSubscriber: Reminder[] = [];

    service.reminderSource.subscribe(
      success => {
        reminderSubscriber = success
        expect(reminderSubscriber.length).toEqual(1);
      },
      error => fail('expected successful GET call')
    );

    service.addReminder(testReminder).subscribe(
      success => {
        reqGet = httpMock.expectOne(`${apiUrl}/reminder`);
        expect(reqGet.request.method).toEqual("GET");
        reqGet.flush([testReminder]);
      },
      error => fail('expected successful POST call')
    );

    const reqPost = httpMock.expectOne(`${apiUrl}/reminder`);
    expect(reqPost.request.method).toEqual("POST");

    reqPost.flush(testReminder);
  }));

  it('#refreshRemindersList should call GET api',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
      service.refreshRemindersList();

      const reqGet = httpMock.expectOne(`${apiUrl}/reminder`);
      expect(reqGet.request.method).toEqual("GET");

      reqGet.flush([testReminder]);
     }
  ));

  it('refreshRemindersList` should trigger update for any subscribers to reminderSource',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {

      let reminderSubscriber: Reminder[] = testData_empty;
      service.reminderSource.subscribe(
        success => {
          reminderSubscriber = success
          expect(reminderSubscriber.length).toEqual(testData.length);
        },
        error => fail('expected successful call')
      );

      service.refreshRemindersList();

      const reqGet = httpMock.match(`${apiUrl}/reminder`)[0];
      reqGet.flush(testData);
   }));

  it('#refreshRemindersList should leave reminderSource with updated value - empty',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
      let reminderSubscriber: Reminder[] = testData;

      service.reminderSource.subscribe(
        success => {
          reminderSubscriber = success
          expect(doArraysContainSameValues(testData_empty, reminderSubscriber))
            .toBeTruthy();
        },
        error => fail('expected successful call')
      );

      service.refreshRemindersList();

      const reqGet = httpMock.match(`${apiUrl}/reminder`)[0];
      reqGet.flush(testData_empty);
   }));

  it('#refreshRemindersList should leave reminderSource with updated value - non-empty ',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
      let reminderSubscriber: Reminder[] = testData;

      service.reminderSource.subscribe(
        success => {
          reminderSubscriber = success
          expect(doArraysContainSameValues(testData, reminderSubscriber))
            .toBeTruthy();
        },
        error => fail('expected successful call')
      );

      service.refreshRemindersList();

      const reqGet = httpMock.match(`${apiUrl}/reminder`)[0];
      reqGet.flush(testData);
   }));

  it('#refreshRemindersList should throw error when API call is not successful',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {

      let reminderSubscriber: Reminder[] = testData;
      service.reminderSource.subscribe(
        success => fail('subscription should not be updated'),
        error => fail('subscription should not be updated')
      );

      service.refreshRemindersList();

      const reqGet = httpMock.match(`${apiUrl}/reminder`)[0];
      reqGet.error(errorEvent);
  }));

  it('#refreshRemindersList should not update Reminders subject when API call is not successful',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
      service.reminderSource.subscribe(
        success => fail('subscription should not be updated'),
        error => fail('subscription should not be updated')
      );

      service.refreshRemindersList();

      const reqGet = httpMock.match(`${apiUrl}/reminder`)[0];
      reqGet.error(errorEvent);
   }));

  it('#updateReminder should call PATCH API with reminder patch values',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {

      let reminderPatch: Reminder = new Reminder({
        id: 2,
        value: "",
        isCompleted: true
      });

      service.updateReminder(reminderPatch).subscribe(
        success => { /* Success! */ },
        error => fail('expected successful call')
      );

      const reqPatch = httpMock.expectOne(`${apiUrl}/reminder/${reminderPatch.id}`);
      expect(reqPatch.request.method).toEqual("PATCH");
      expect(reqPatch.request.body).toEqual(reminderPatch);
      expect(reqPatch.request.headers).toEqual(service.patchOptions.headers);

      reqPatch.flush(null);
  }));

  it('#updateReminder should refresh reminders list if successful',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
      const reminderValue: string = "A reminder";
      const reminderToPatch: Reminder = new Reminder({
        id: 2,
        value: reminderValue,
        isCompleted: false
      });
      const patchedReminder: Reminder = new Reminder({
        id: 2,
        value: reminderValue,
        isCompleted: true
      });
      let reminderPatch: Reminder = new Reminder({
        id: 2,
        value: null,
        isCompleted: true
      });
      let reqGet: TestRequest;

      let reminderSubscriber: Reminder[] = [reminderToPatch];
      service.reminderSource.subscribe(
        success => {
          reminderSubscriber = success
          let updatedReminder: Reminder = reminderSubscriber.find(x => x.id == reminderPatch.id);
          expect(updatedReminder.isCompleted).toBeTruthy();
          expect(updatedReminder.value).toEqual(reminderValue);
        },
        error => fail('expected successful update')
      );

      service.updateReminder(reminderPatch).subscribe(
        success => {
          reqGet = httpMock.expectOne(`${apiUrl}/reminder`);
          expect(reqGet.request.method).toEqual("GET");
          reqGet.flush([patchedReminder]);
        },
        error => fail('expected successful call')
      );

      const reqPatch = httpMock.expectOne(`${apiUrl}/reminder/${reminderPatch.id}`);
      reqPatch.flush(null);
  }));

  it('#updateReminder should not update reminderSource list if unsuccessful',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
      const reminderValue: string = "A reminder";
      const reminderToPatch: Reminder = new Reminder({
        id: 2,
        value: reminderValue,
        isCompleted: false
      });
      const patchedReminder: Reminder = new Reminder({
        id: 2,
        value: reminderValue,
        isCompleted: true
      });
      let reminderPatch: Reminder = new Reminder({
        id: 2,
        value: null,
        isCompleted: true
      });
      let reqGet: TestRequest;

      let reminderSubscriber: Reminder[] = [reminderToPatch];
      service.reminderSource.subscribe(
        success => fail('this subscription should not update'),
        error => fail('this subscription should not update')
      );

      service.updateReminder(reminderPatch).subscribe(
        success => {
          reqGet = httpMock.expectOne(`${apiUrl}/reminder`);
          expect(reqGet.request.method).toEqual("GET");
          reqGet.flush([patchedReminder]);
        },
        error => {/* Success! (I mean... Error!) */}
      );

      const reqPatch = httpMock.expectOne(`${apiUrl}/reminder/${reminderPatch.id}`);
      reqPatch.error(errorEvent);
  }));

  it('#updateReminder should return error response when API call is not successful',
     inject([HttpTestingController, ReminderService],
            (httpMock: HttpTestingController, service: ReminderService) => {
      let reminderPatch: Reminder = new Reminder({
        id: 2,
        value: null,
        isCompleted: true
      });

      service.updateReminder(reminderPatch).subscribe(
        success => fail('expected error result'),
        error => {/* Success! (I mean... Error!) */}
      );

      const reqPatch = httpMock.match(`${apiUrl}/reminder/${reminderPatch.id}`)[0];
      reqPatch.error(errorEvent);
   }));
});

