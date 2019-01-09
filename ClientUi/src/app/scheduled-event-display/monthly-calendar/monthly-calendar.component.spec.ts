import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCalendarComponent } from './monthly-calendar.component';

describe('MonthlyCalendarComponent', () => {
  let component: MonthlyCalendarComponent;
  let fixture: ComponentFixture<MonthlyCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
