import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledEventDisplayComponent } from './scheduled-event-display.component';

describe('ScheduledEventDisplayComponent', () => {
  let component: ScheduledEventDisplayComponent;
  let fixture: ComponentFixture<ScheduledEventDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledEventDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledEventDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
