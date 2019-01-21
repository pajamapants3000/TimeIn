import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCalendarComponent } from './monthly-calendar.component';

describe('MonthlyCalendarComponent', () => {
  let component: MonthlyCalendarComponent;
  let fixture: ComponentFixture<MonthlyCalendarComponent>;
  let titleMsg: string = "monthly-calendar works!";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyCalendarComponent ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display message monthly-calendar works!',
     () => {
    expect(fixture.nativeElement.innerText).toEqual(titleMsg);
  });

  it(`should have as title 'angular-practice'`, () => {
    expect(component.title).toEqual(titleMsg);
  });

  it('should render title in a h1 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(titleMsg);
  });
});
