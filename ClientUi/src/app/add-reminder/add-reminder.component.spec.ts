import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AddReminderComponent } from './add-reminder.component';
import { Reminder } from '../models/reminder';
import { ReminderService } from '../reminder.service';
import { click } from '../common';

@Component({selector: 'mat-form-field', template: '<ng-content></ng-content>'})
class MatFormFieldStub { }

describe('AddReminderComponent', () => {
  let component: AddReminderComponent;
  let fixture: ComponentFixture<AddReminderComponent>;
  let reminderServiceSpy: jasmine.SpyObj<ReminderService>;
  const reminderToAdd: Reminder = new Reminder({
    value: "reminderToAdd",
    isCompleted: false
  });

  beforeEach(() => {
    let spy = jasmine.createSpyObj('ReminderService',
                                              ['addReminder']);
    TestBed.configureTestingModule({
      declarations: [
        AddReminderComponent,
        MatFormFieldStub,
      ],
      providers: [
        { provide: ReminderService, useValue: spy }
      ]
    })

    reminderServiceSpy = TestBed.get(ReminderService);
    reminderServiceSpy.addReminder.and.returnValue(of(reminderToAdd));

    fixture = TestBed.createComponent(AddReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Template-related Tests */
  it('should render a button',
    () => {
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button');
    expect(button).toBeTruthy();
  });
  it('should have a text input',
    () => {
    const inner = fixture.nativeElement.querySelector('mat-form-field');
    expect(inner).toBeTruthy();
  });
  it('should create new reminder when button clicked',
    () => {
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button');
    const input = element.querySelector('input');
    reminderServiceSpy.addReminder.calls.reset();

    input.value = reminderToAdd.value;
    click(button);

    expect(reminderServiceSpy.addReminder).toHaveBeenCalledWith(reminderToAdd);
  });
  it('should clear the input text field when button is clicked',
    () => {
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button');
    const input = element.querySelector('input');

    input.value = reminderToAdd.value;
    click(button);
    fixture.detectChanges(); // test requires page to render changes

    expect(input.value).toEqual("");
  });

  /* Class-related Tests */
  it('should create new reminder when `addReminder` called',
    () => {
    reminderServiceSpy.addReminder.calls.reset();
    component.addReminder(reminderToAdd.value);
    expect(reminderServiceSpy.addReminder).toHaveBeenCalledWith(reminderToAdd);
   });

});
