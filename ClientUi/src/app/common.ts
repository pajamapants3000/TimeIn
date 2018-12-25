import { DebugElement } from '@angular/core';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

export const urlBase: string = 'http://TimeIn.Lilu-WindXPro';
export const apiUrl: string =
  `${(AppComponent.useInMemoryWebApi && !environment.production) ? '' : urlBase}/api`;
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

