import { DebugElement } from '@angular/core';
import { Reminder } from './reminder';

export const reminderUrl: string = 'http://TimeIn.Lilu-WindXPro/api/reminder';
export const inMemoryUrlBase: string = '/api';
export const reminderTestUrl: string = inMemoryUrlBase + '/reminder';
// note: as of now, can't really use this in import statement
// this is just for manual referencing
export const testDataJsonPath: string = '../testData.json';

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

export function reminderCompare(a: Reminder, b: Reminder): number {
  if (a.isCompleted == b.isCompleted)
  {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    if (a.id == b.id) return 0;
  }
  else if (a.isCompleted == true) return 1;
  else return -1;
}

