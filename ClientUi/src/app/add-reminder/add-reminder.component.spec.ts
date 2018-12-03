import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AddReminderComponent } from './add-reminder.component';

import { ReminderService } from '../reminder.service';
import { doArraysContainSameValues, click } from '../common';
import { Reminder } from '../reminder';

describe('AddReminderComponent', () => {
  let component: AddReminderComponent;
  let fixture: ComponentFixture<AddReminderComponent>;
  let reminderServiceSpy: jasmine.SpyObj<ReminderService>;
  const reminderToAdd: Reminder = { value: "reminderToAdd" } as Reminder;

  beforeEach(() => {
    let spy = jasmine.createSpyObj('ReminderService',
                                              ['addReminder']);
    TestBed.configureTestingModule({
      declarations: [ AddReminderComponent ],
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

  it('should create',
    () => {
    expect(component).toBeTruthy();
  });

  /* Template-related Tests */
  it('should have a button',
    () => {
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should have a text input',
    () => {
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should call addReminder service method with input text when button clicked',
    () => {
    let callsAfterInit = reminderServiceSpy.addReminder.calls.count();
    expect(reminderServiceSpy.addReminder).not
      .toHaveBeenCalledWith(reminderToAdd);
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button');
    const input = element.querySelector('input');
    input.value = reminderToAdd.value;
    click(button);

    expect(reminderServiceSpy.addReminder.calls.count())
      .toEqual(callsAfterInit + 1);
    expect(reminderServiceSpy.addReminder).toHaveBeenCalledWith(reminderToAdd);
  });

  it('should clear the input text field when button is clicked',
    () => {
    let callsAfterInit = reminderServiceSpy.addReminder.calls.count();
    expect(reminderServiceSpy.addReminder).not
      .toHaveBeenCalledWith(reminderToAdd);
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button');
    const input = element.querySelector('input');
    input.value = reminderToAdd.value;
    click(button);
    fixture.detectChanges();

    expect(input.value).toEqual("");
  });

  /* Class-related Tests */
  it('#addReminder should call addReminder service method with input text as Reminder',
    () => {
    let callsAfterInit = reminderServiceSpy.addReminder.calls.count();
    expect(reminderServiceSpy.addReminder).not
      .toHaveBeenCalledWith(reminderToAdd);
    component.addReminder(reminderToAdd.value);
    fixture.detectChanges();
    expect(reminderServiceSpy.addReminder.calls.count())
      .toEqual(callsAfterInit + 1);
    expect(reminderServiceSpy.addReminder).toHaveBeenCalledWith(reminderToAdd);
   });

});

