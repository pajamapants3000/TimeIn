import { DebugElement } from '@angular/core';

export const reminderUrl: string = 'http://localhost:5000/api/reminder';
export const reminderTestUrl: string = 'api/reminder_test';

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

