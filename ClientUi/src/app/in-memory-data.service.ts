import {
  InMemoryDbService,
  RequestInfo,
  ResponseOptions,
  } from 'angular-in-memory-web-api';
import { STATUS } from 'angular-in-memory-web-api/http-status-codes';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import * as json from '../../../testData.json';
import { Reminder } from './reminder';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  public useEmptyRemindersList: Boolean = false;

  createDb() {
    const reminder: Reminder[] = this.useEmptyRemindersList ?
      [] as Reminder[] :
      json.Reminder.map(i => {
      return {
        id: i.id,
        value: i.value,
        isCompleted: i.isCompleted
      } as Reminder;
    });

    return {reminder};
  }

  constructor() { }

  genId(reminders: Reminder[]): number {
    return reminders.length > 0 ?
      Math.max(...reminders.map(reminder => reminder.id)) + 1 :
      11;
  }

  /*
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
