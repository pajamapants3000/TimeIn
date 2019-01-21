import { TestBed } from '@angular/core/testing';

import { DisplayService } from './display.service';
import { DisplayKind } from './display-kind';
import { ListComponent } from './list/list.component';
import { MonthlyCalendarComponent } from './monthly-calendar/monthly-calendar.component';

describe('DisplayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplayService = TestBed.get(DisplayService);
    expect(service).toBeTruthy();
  });
  it('should return ListComponent when `getDisplayComponent` called with DisplayKind.List',
     () => {
    const service: DisplayService = TestBed.get(DisplayService);
    let returnValue = service.getDisplayComponent(DisplayKind.List);
    expect(returnValue).toEqual(ListComponent);
  });
  it('should return MonthlyCalendarComponent when `getDisplayComponent` called with DisplayKind.Monthly',
     () => {
    const service: DisplayService = TestBed.get(DisplayService);
    let returnValue = service.getDisplayComponent(DisplayKind.Monthly);
    expect(returnValue).toEqual(MonthlyCalendarComponent);
  });
});
