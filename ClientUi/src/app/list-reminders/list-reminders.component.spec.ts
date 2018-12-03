import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRemindersComponent } from './list-reminders.component';
import { ReminderFakeService } from '../reminder.fake.service';
import { ReminderService } from '../reminder.service';
import { REMINDERS } from '../mock-reminders'
import { REMINDERS_EMPTY } from '../mock-reminders-empty'
import { doArraysContainSameValues } from '../common';
import { Reminder } from '../reminder';

describe('ListRemindersComponent', () => {
  let component: ListRemindersComponent;
  let fixture: ComponentFixture<ListRemindersComponent>;
  let fakeService: ReminderFakeService = new ReminderFakeService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRemindersComponent ],
      providers: [
        { provide: ReminderService, useValue: fakeService }
      ]
    })
    fakeService.fakeData = REMINDERS_EMPTY;

    fixture = TestBed.createComponent(ListRemindersComponent);
    component = fixture.componentInstance;
  });

  it('should be created',
    () => {
    expect(component).toBeTruthy();
  });

  /* Template-related tests */
  it('should render h2 heading "Reminders"',
    () => {
    const element: HTMLElement = fixture.nativeElement;
    const h2 = element.querySelector('h2');
    expect(h2.textContent).toEqual('Reminders');
  });

  it('should render an unordered list',
    () => {
    const element: HTMLElement = fixture.nativeElement;
    const ul = element.querySelector('ul');
    expect(ul).toBeTruthy();
  });

  it('should render an empty list when storage is empty',
     () => {
    fakeService.fakeData = REMINDERS_EMPTY;
    component.ngOnInit();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('ul')
    let listItems = remindersListElement.getElementsByTagName('li');
    let listValues: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].getElementsByTagName('span')[0].textContent)
    }
    let reminderExpectedValues = fakeService.fakeData
      .map(reminder => reminder.value);

    expect(doArraysContainSameValues(reminderExpectedValues, listValues))
      .toBeTruthy();
  });

  it('should render list matching result of `listReminders` when non-empty',
     () => {
    fakeService.fakeData = REMINDERS;
    component.ngOnInit();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('ul')
    let listItems = remindersListElement.getElementsByTagName('li');
    let listValues: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].getElementsByTagName('span')[0].textContent)
    }
    let reminderExpectedValues = fakeService.fakeData
      .map(reminder => reminder.value);

    expect(doArraysContainSameValues(reminderExpectedValues, listValues))
      .toBeTruthy();
  });

  it('should render updated list when data changes',
     () => {
    let expectedResult: Reminder[] = [...REMINDERS,
      { value:'new reminder' } as Reminder];

    fakeService.fakeData = REMINDERS;
    component.ngOnInit();
    fixture.detectChanges();

    fakeService.fakeData = expectedResult;
    fakeService.updateReminders();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('ul')
    let listItems = remindersListElement.getElementsByTagName('li');
    let listValues: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].getElementsByTagName('span')[0].textContent)
    }
    let reminderExpectedValues = fakeService.fakeData
      .map(reminder => reminder.value);

    expect(doArraysContainSameValues(reminderExpectedValues, listValues))
      .toBeTruthy();
   });

  /* Class-related tests */
  it('should call service method updateReminders in ngOnInit',
     () => {
    let spy = spyOn(fakeService, "updateReminders");
    let initialCallCount = spy.calls.count();
    component.ngOnInit();

    expect(spy.calls.count()).toEqual(initialCallCount + 1);
  });
});

