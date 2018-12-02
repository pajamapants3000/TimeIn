import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ListRemindersComponent } from './list-reminders.component';
import { ReminderService } from '../reminder.service';
import { REMINDERS } from '../mock-reminders'
import { REMINDERS_EMPTY } from '../mock-reminders-empty'
import { doArraysContainSameValues } from '../common';

describe('ListRemindersComponent', () => {
  let component: ListRemindersComponent;
  let fixture: ComponentFixture<ListRemindersComponent>;
  let reminderServiceSpy: jasmine.SpyObj<ReminderService>;

  beforeEach(() => {
    let spy = jasmine.createSpyObj('ReminderService',
                                              ['listReminders']);
    TestBed.configureTestingModule({
      declarations: [ ListRemindersComponent ],
      providers: [
        { provide: ReminderService, useValue: spy }
      ]
    })
    reminderServiceSpy = TestBed.get(ReminderService);
    reminderServiceSpy.listReminders.and.returnValue(of(REMINDERS_EMPTY));

    fixture = TestBed.createComponent(ListRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Template-related tests */
  it('should render h2 heading "Reminders"', () => {
    const element: HTMLElement = fixture.nativeElement;
    const h2 = element.querySelector('h2');
    expect(h2.textContent).toEqual('Reminders');
  });

  it('should render an unordered list', () => {
    const element: HTMLElement = fixture.nativeElement;
    const ul = element.querySelector('ul');
    expect(ul).toBeTruthy();
  });

  it('should render an empty list when `listReminders` returns empty list',
     () => {
    component.listReminders();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('ul')
    let listItems = remindersListElement.getElementsByTagName('li');
    let listValues: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].getElementsByTagName('span')[0].textContent)
    }

    expect(doArraysContainSameValues(REMINDERS_EMPTY, listValues)).toBeTruthy();
  });

  it('should render list matching result of `listReminders` when non-empty',
     () => {
    reminderServiceSpy.listReminders.and.returnValue(of(REMINDERS));
    component.listReminders();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('ul')
    let listItems = remindersListElement.getElementsByTagName('li');
    let listValues: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].getElementsByTagName('span')[0].textContent)
    }

    let remindersValues: string[] = REMINDERS.map((reminder) => reminder.value);
    expect(doArraysContainSameValues(remindersValues, listValues)).toBeTruthy();
  });

  it('should render same list results if service call to listReminders fails',
     () => {
    reminderServiceSpy.listReminders.and.throwError('service returned error');

    let beforeList: string[] = [];
    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('ul')
    let listItems = remindersListElement.getElementsByTagName('li');

    for (let i = 0; i < listItems.length; i++) {
      beforeList.push(listItems[i].getElementsByTagName('span')[0].textContent)
    }

    try {
    component.listReminders();
    } catch (e) { }
    fixture.detectChanges();

    listItems = remindersListElement.getElementsByTagName('li');
    let afterList: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      afterList.push(listItems[i].getElementsByTagName('span')[0].textContent)
    }

    expect(doArraysContainSameValues(beforeList, afterList)).toBeTruthy();
  });

  /* Class-related tests */
  it('should call listReminders when initialized (ngOnInit)', () => {
    expect(reminderServiceSpy.listReminders.calls.count()).toEqual(1);
  });

  it('should call listReminders in ngOnInit',
     () => {
    let initialCallCount = reminderServiceSpy.listReminders.calls.count();
    component.ngOnInit();

    expect(reminderServiceSpy.listReminders.calls.count())
      .toEqual(initialCallCount + 1);
  });

  it('#listReminders should call GET API', () => {
      let callsAfterInit = reminderServiceSpy.listReminders.calls.count();
      component.listReminders();
      expect(reminderServiceSpy.listReminders.calls.count())
        .toEqual(callsAfterInit + 1);
  });
});

