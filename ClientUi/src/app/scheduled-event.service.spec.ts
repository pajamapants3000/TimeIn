import { TestBed, inject } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ScheduledEventService } from './scheduled-event.service';
import {
  apiUrl,
  doArraysContainSameValues,
  storedUtcDateToDate
} from './common'
import { ScheduledEvent } from './models/scheduled-event';
import { AppComponent } from './app.component';
import * as json from '../../../testData.json';


describe('ScheduledEventService', () => {
  let testData = json.ScheduledEvent.map(i => {
    return new ScheduledEvent({
      id: i.id,
      description: i.description,
      name: i.name,
      when: storedUtcDateToDate(new Date(i.when)),
      durationInMinutes: i.durationInMinutes
    });
  });
  let testData_empty: ScheduledEvent[] = [];

  const testScheduledEvent: ScheduledEvent = new ScheduledEvent({
    id: null,
    name: "ScheduledEvent to add",
    description: "This is a new event",
    when: new Date(Date.now()),
    durationInMinutes: 33,
  });

  const errorScheduledEvent: ErrorEvent = new ErrorEvent('Network error', {
    message: 'Network error'
  });


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScheduledEventService],
      imports: [HttpClientTestingModule],
    })
  });

  it('should be created', () => {
    const service: ScheduledEventService = TestBed.get(ScheduledEventService);
    expect(service).toBeTruthy();
  });

  it('#getScheduledEventList should make GET request to "~/api/scheduledEvent"',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      service.getScheduledEventList().subscribe();

      const reqGet = httpMock.expectOne(`${apiUrl}/scheduledEvent`);
      expect(reqGet.request.method).toEqual("GET");

      reqGet.flush(testData);
  }));
  it('#getScheduledEventList should return list of events from response to successful GET request',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      service.getScheduledEventList().subscribe(
        success => {
          expect(success.length).toEqual(testData.length);
        },
        error => fail('expected successful call')
      );

      const reqGet = httpMock.match(`${apiUrl}/scheduledEvent`)[0];
      expect(reqGet).toBeTruthy();

      reqGet.flush(testData);
  }));
  it('#getScheduledEventList should throw error on failed GET response',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      service.getScheduledEventList().subscribe(
        success => fail('expected failure'),
        error => { /* Success! */ }
      );

      const reqGet = httpMock.match(`${apiUrl}/scheduledEvent`)[0];
      expect(reqGet).toBeTruthy();

      reqGet.error(errorScheduledEvent);
  }));
  it('#getScheduledEvent should make GET request to "~-api/scheduledEvent/<id>"',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      const getId: number = 2;
      const _testScheduledEvent = testScheduledEvent;
      _testScheduledEvent.id = getId;
      service.getScheduledEvent(getId).subscribe();

      const reqGet = httpMock.expectOne(`${apiUrl}/scheduledEvent/${getId}`);
      expect(reqGet.request.method).toEqual("GET");

      reqGet.flush(_testScheduledEvent);
  }));
  it('#getScheduledEvent should return event from response to successful GET request',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      const getId: number = 2;
      const _testScheduledEvent = testScheduledEvent;
      _testScheduledEvent.id = getId;
      service.getScheduledEvent(getId).subscribe(
        success => {
          expect(success.name).toEqual(_testScheduledEvent.name);
          expect(success.description).toEqual(_testScheduledEvent.description);
          expect(success.when).toEqual(_testScheduledEvent.when);
          expect(success.durationInMinutes).toEqual(_testScheduledEvent.durationInMinutes);
          expect(success.id).toEqual(getId);
        },
        error => fail('expected successful call')
      );

      const reqGet = httpMock.match(`${apiUrl}/scheduledEvent/${getId}`)[0];
      expect(reqGet).toBeTruthy();

      reqGet.flush(_testScheduledEvent);
  }));
  it('#getScheduledEvent should throw error on failed GET response',
    inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      const getId: number = 2;
      const _testScheduledEvent = testScheduledEvent;
      _testScheduledEvent.id = getId;
    service.getScheduledEvent(getId).subscribe(
      success => fail('expected failure'),
      error => {/* expected failure */}
    );

    const reqGet = httpMock.match(`${apiUrl}/scheduledEvent/${getId}`)[0];
    expect(reqGet).toBeTruthy();

    reqGet.error(errorScheduledEvent);
  }));
  it('#addScheduledEvent should make POST request to "~/api/scheduledEvent"',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {

      service.addScheduledEvent(testScheduledEvent).subscribe(
        success => { /* Success! */ },
        error => fail('expected successful call')
      );

      const reqPost = httpMock.expectOne(`${apiUrl}/scheduledEvent`);
      expect(reqPost.request.method).toEqual("POST");
      expect(reqPost.request.body).toEqual(testScheduledEvent);
      reqPost.flush(testScheduledEvent);
  }));
  it('#addScheduledEvent should return newly-created event from successful POST response',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      service.addScheduledEvent(testScheduledEvent).subscribe(
        success => {
          expect(success.name).toEqual(testScheduledEvent.name);
          expect(success.description).toEqual(testScheduledEvent.description);
          expect(success.when).toEqual(testScheduledEvent.when);
          expect(success.durationInMinutes).toEqual(testScheduledEvent.durationInMinutes);
          expect(success.id).toBeTruthy("new event gets ID assigned and returned");
        },
        error => fail('expected successful call')
      );

      const req = httpMock.match(`${apiUrl}/scheduledEvent`)[0];
      expect(req).toBeTruthy();

      req.flush(testScheduledEvent);
  }));
  it('#addScheduledEvent should throw error on failed POST response',
    inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
    service.addScheduledEvent(testScheduledEvent).subscribe(
      success => fail('expected failure'),
      error => {/* expected failure */}
    );

    const req = httpMock.match(`${apiUrl}/scheduledEvent`)[0];
    expect(req).toBeTruthy();

    req.error(errorScheduledEvent);
  }));
  it('#updateScheduledEvent should make PATCH request to "~/api/scheduledEvent/<id>"',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      const patchId: number = 2;
      const eventPatch: ScheduledEvent = new ScheduledEvent({
        id: patchId,
        name: "Updated name",
        when: new Date(1981, 11, 6),
        description: null,
        durationInMinutes: null,
      });

      if (AppComponent.useInMemoryWebApi) {
        const _testScheduledEvent = testScheduledEvent;
        _testScheduledEvent.id = patchId;
        _testScheduledEvent.name = eventPatch.name;
        _testScheduledEvent.when = eventPatch.when;
        service.updateScheduledEvent(_testScheduledEvent).subscribe();

        const reqPut = httpMock.expectOne(`${apiUrl}/scheduledEvent`);
        expect(reqPut.request.method).toEqual("PUT");

        reqPut.flush(_testScheduledEvent);
      } else {
        service.updateScheduledEvent(eventPatch).subscribe();
        const reqPatch = httpMock.expectOne(`${apiUrl}/scheduledEvent/${patchId}`);
        expect(reqPatch.request.method).toEqual("PATCH");

        reqPatch.flush(null);
      }
  }));
  it('#updateScheduledEvent should return null from successful PATCH response',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      const patchId: number = 2;
      const eventPatch: ScheduledEvent = new ScheduledEvent({
        id: patchId,
        name: "Updated name",
        when: new Date(1981, 11, 6),
        description: null,
        durationInMinutes: null,
      });

      if (AppComponent.useInMemoryWebApi) {
        const _testScheduledEvent = testScheduledEvent;
        _testScheduledEvent.id = patchId;
        _testScheduledEvent.name = eventPatch.name;
        _testScheduledEvent.when = eventPatch.when;

        service.updateScheduledEvent(_testScheduledEvent).subscribe(
          success => { /* Success! */ },
          error => fail('expected successful call')
        );

        const reqPut = httpMock.match(`${apiUrl}/scheduledEvent`)[0];
        expect(reqPut).toBeTruthy();

        reqPut.flush(null);
      } else {
        service.updateScheduledEvent(eventPatch).subscribe(
          success => { expect(success).toBeNull() },
          error => fail('expected successful call')
        );


        const reqPatch = httpMock.match(`${apiUrl}/scheduledEvent/${patchId}`)[0];
        expect(reqPatch).toBeTruthy();

        reqPatch.flush(null);
      }
  }));
  it('#updateScheduledEvent should throw error on failed PATCH response',
     inject([HttpTestingController, ScheduledEventService],
            (httpMock: HttpTestingController, service: ScheduledEventService) => {
      const patchId: number = 2;
      const eventPatch: ScheduledEvent = new ScheduledEvent({
        id: patchId,
        name: "Updated name",
        when: new Date(1981, 11, 6),
        description: null,
        durationInMinutes: null,
      });

      if (AppComponent.useInMemoryWebApi) {
        const _testScheduledEvent = testScheduledEvent;
        _testScheduledEvent.id = patchId;
        _testScheduledEvent.name = eventPatch.name;
        _testScheduledEvent.when = eventPatch.when;

        service.updateScheduledEvent(_testScheduledEvent).subscribe(
          success => fail('expected failure'),
          error => {/* expected failure */}
        );

        const reqPut = httpMock.match(`${apiUrl}/scheduledEvent`)[0];
        expect(reqPut).toBeTruthy();

        reqPut.error(errorScheduledEvent);
      } else {
        service.updateScheduledEvent(eventPatch).subscribe(
          success => fail('expected failure'),
          error => {/* expected failure */}
        );

        const reqPatch = httpMock.match(`${apiUrl}/scheduledEvent/${patchId}`)[0];
        expect(reqPatch).toBeTruthy();

        reqPatch.error(errorScheduledEvent);
      }
  }));
});
