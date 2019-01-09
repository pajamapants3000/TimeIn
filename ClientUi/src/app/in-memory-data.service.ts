import {
  InMemoryDbService,
  RequestInfo,
  ResponseOptions,
  } from 'angular-in-memory-web-api';
import { STATUS } from 'angular-in-memory-web-api/http-status-codes';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import * as json from '../../../testData.json';
import { Reminder } from './models/reminder';
import { ScheduledEvent } from './models/scheduled-event';
import { Identifiable } from './models/identifiable';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  public useEmptyData: Boolean = false;

  createDb() {
    const reminder: Reminder[] = this.useEmptyData ?
      [] as Reminder[] :
      json.Reminder.map(i => {
      return new Reminder({
        id: i.id,
        value: i.value,
        isCompleted: i.isCompleted
      });
    });

    const scheduledEvent: ScheduledEvent[] = this.useEmptyData ?
      [] as ScheduledEvent[] :
      json.ScheduledEvent.map(i => {
      return new ScheduledEvent().deserialize(i)
    });

    return {reminder, scheduledEvent};
  }

  constructor() { }

  genId(entities: Identifiable[]): number {
    return entities.length > 0 ?
      Math.max(...entities.map(entity => entity.id)) + 1 :
      11;
  }

  /*
   * I don't know if this is reasonable to accomplish, but maybe at some point...
  protected patch(reqInfo: RequestInfo): ResponseOptions {
    const collectionName: string = reqInfo.collectionName;
    const collection: Reminder[] = reqInfo.collection;
    const id: number = reqInfo.id;

    if (id == undefined) {
      return {
        url: reqInfo.url,
        headers: reqInfo.headers,
        status: STATUS.NOT_FOUND,
        statusText: `Missing '${collectionName}' id`
      };
    }

    const existingIx = reqInfo.collection.indexOf(collection, id);
    let reminderToPatch: Reminder = reqInfo.utils.findById(collection, id);
    const patches: any = JSON.parse(reqInfo.utils.getJsonBody(reqInfo.req));

    if (patches.hasOwnProperty('id') && id !== patches.id) {
      return {
        url: reqInfo.url,
        headers: reqInfo.headers,
        status: STATUS.BAD_REQUEST,
        statusText: `Request for '${collectionName}' id does not match item.id`
      };
    }

    if (patches.hasOwnProperty('value')) {
      reminderToPatch.value = patches.value;
    }

    if (patches.hasOwnProperty('isCompleted')) {
      reminderToPatch.isCompleted = patches.isCompleted;
    }

    collection[existingIx] = reminderToPatch;

    return {
      url: reqInfo.url,
      headers: reqInfo.headers,
      status: STATUS.NO_CONTENT,
    };
  }
 */
}
