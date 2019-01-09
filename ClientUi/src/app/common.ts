import { DebugElement } from '@angular/core';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

export const urlBase: string = 'http://TimeIn.Lilu-WindXPro';
export const apiUrl: string =
  `${(AppComponent.useInMemoryWebApi && !environment.production) ? '' : urlBase}/api`;
// note: as of now, can't really use this in import statement
// this is just for manual referencing
export const testDataJsonPath: string = '../testData.json';

export const msPerMinute: number = 1000 * 60;
export const msPerHour: number = 60 * msPerMinute;
export const msPerDay: number = 24 * msPerHour;

// write string[] comparison method
export function doArraysContainSameValues<TItem>(a: TItem[], b: TItem[]): boolean {
  if ((a === null) != (b === null)) {
    return false;
  }

  if (a.length != b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) {
      return false;
    }
  }

  return true;
}

export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

export function click(el: DebugElement | HTMLElement,
                      eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

export function storedUtcDateToDate(stored: Date) {
  let initial = new Date(stored);
  return new Date(Date.UTC(
    initial.getFullYear(),
    initial.getMonth(),
    initial.getDate(),
    initial.getHours(),
    initial.getMinutes(),
    initial.getSeconds(),
    initial.getMilliseconds()
  ));
}

