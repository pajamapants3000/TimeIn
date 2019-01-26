import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { click } from './common';

@Component({selector: 'app-add-reminder', template: ''})
class AddReminderStub {}
@Component({selector: 'app-list-reminders', template: ''})
class ListRemindersStub {}
@Component({selector: 'app-scheduled-events', template: ''})
class ScheduledEventsStub {}
@Component({selector: 'mat-tab', template: '<ng-content></ng-content>'})
class MatTabStub { }
@Component({selector: 'mat-tab-group', template: '<ng-content></ng-content>'})
class MatTabGroupStub { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ListRemindersStub,
        ScheduledEventsStub,
        AddReminderStub,
        MatTabStub,
        MatTabGroupStub,
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
  it(`should have as title 'Welcome to TimeIn!'`, () => {
    expect(component.title).toEqual('Welcome to TimeIn!');
  });
  it('should render title in a h1 tag', () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('h1').textContent).toContain(component.title);
  });
  it('should render add-reminder element ("app-add-reminder")',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('app-add-reminder')).toBeTruthy();
  });
  it('should render list-reminders element ("app-list-reminders")',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('app-list-reminders')).toBeTruthy();
  });
  it('should render tab element',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('mat-tab-group')).toBeTruthy();
  });
  it('should have two tabs: "To-do" and "Scheduled Events"',
     () => {
    const element = fixture.debugElement.nativeElement;
    const tabs = element.querySelectorAll('mat-tab');
    expect(tabs.length).toEqual(2);
    expect(tabs[0].attributes.getNamedItem('label'))
      .toBeDefined("tab 0 label defined");
    expect(tabs[0].attributes.getNamedItem('label').value)
      .toEqual("To-do", "To-do tab at index 0");
    expect(tabs[1].attributes.getNamedItem('label'))
      .toBeDefined("tab 1 label defined");
    expect(tabs[1].attributes.getNamedItem('label').value)
      .toEqual("Scheduled Events", "Events tab at index 1");
  });
  it('should render ScheduledEvents component',
     () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('app-scheduled-events'))
      .toBeTruthy("render ScheduledEvents component");
  });
});

