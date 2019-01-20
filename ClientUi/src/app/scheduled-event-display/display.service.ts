import { Injectable, ComponentFactoryResolver } from '@angular/core';

import { DisplayKind } from './display-kind';
import { ListComponent } from './list/list.component';
import { MonthlyCalendarComponent } from './monthly-calendar/monthly-calendar.component';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  getDisplayComponent(kind: DisplayKind) {
    switch (kind) {
      case DisplayKind.None:
        return null;
      case DisplayKind.List:
        return ListComponent;
      case DisplayKind.Monthly:
        return MonthlyCalendarComponent;
    }
  }
}
