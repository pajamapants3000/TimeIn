import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

@Component({selector: 'app-add-reminder', template: ''})
class AddReminderStubComponent {}
@Component({selector: 'app-list-reminders', template: ''})
class ListRemindersStubComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ListRemindersStubComponent,
        AddReminderStubComponent
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Welcome to TimeIn!'`, () => {
    expect(component.title).toEqual('Welcome to TimeIn!');
  });

  it('should render title in a h1 tag', () => {
    fixture.detectChanges();
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('h1').textContent).toContain(component.title);
  });

  it('should render add-reminder element ("app-add-reminder")',
     () => {
    fixture.detectChanges();
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('app-add-reminder')).toBeTruthy();
  });

  it('should render list-reminders element ("app-list-reminders")',
     () => {
    fixture.detectChanges();
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('app-list-reminders')).toBeTruthy();
  });
});
