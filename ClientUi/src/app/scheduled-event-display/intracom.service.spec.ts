import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import * as json from '../../../../testData.json';

import { IntracomService } from './intracom.service';
import { ScheduledEvent } from '../models/scheduled-event';
import { storedUtcDateToDate } from '../common';

describe('IntracomService', () => {
  let testData: ScheduledEvent[];

  beforeEach(
    () => {
      TestBed.configureTestingModule({})
      testData = json.ScheduledEvent.map(i => {
        return new ScheduledEvent({
          id: i.id,
          description: i.description,
          name: i.name,
          when: storedUtcDateToDate(new Date(i.when)),
          durationInMinutes: i.durationInMinutes
        });
      });
  });

  it('should be created', () => {
    const service: IntracomService = TestBed.get(IntracomService);
    expect(service).toBeTruthy();
  });
  it('should return observable of scheduledEventsSource when getScheduledEvents$ called',
     () => {
    let subject: Subject<ScheduledEvent[]> = new Subject<ScheduledEvent[]>();
    const service: IntracomService = TestBed.get(IntracomService);
    service.scheduledEventsSource = subject;

    let testObservable = service.getScheduledEvents$();
    let subscriptionResult: ScheduledEvent[];
    testObservable.subscribe(
      success => {
        subscriptionResult = success;
    });
    subject.next(testData);

    expect(subscriptionResult.length).toEqual(testData.length);
  });
  it('should return observable of idSelectedSource when getIdSelected$ called',
     () => {
    const arbitraryId: number = 2;
    let subject: Subject<number> = new Subject<number>();
    const service: IntracomService = TestBed.get(IntracomService);
    service.idSelectedSource = subject;

    let testObservable = service.getIdSelected$();
    let subscriptionResult: number;
    testObservable.subscribe(
      success => {
        subscriptionResult = success;
    });
    subject.next(arbitraryId);

    expect(subscriptionResult).toEqual(arbitraryId);
  });
  it('should update scheduledEventsSource subscribers when onScheduledEventsUpdated called',
     () => {
    const service: IntracomService = TestBed.get(IntracomService);

    let testObservable = service.getScheduledEvents$();
    let subscriptionResult: ScheduledEvent[];
    testObservable.subscribe(
      success => {
        subscriptionResult = success;
    });
    service.onScheduledEventsUpdated(testData);

    expect(subscriptionResult.length).toEqual(testData.length);
  });
  it('should update idSelectedSource subscribers when onIdSelected called',
     () => {
    const arbitraryId: number = 2;
    const service: IntracomService = TestBed.get(IntracomService);

    let testObservable = service.getIdSelected$();
    let subscriptionResult: number;
    testObservable.subscribe(
      success => {
        subscriptionResult = success;
    });
    service.onIdSelected(arbitraryId);

    expect(subscriptionResult).toEqual(arbitraryId);
  });
});
