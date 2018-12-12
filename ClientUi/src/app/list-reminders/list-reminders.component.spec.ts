import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRemindersComponent } from './list-reminders.component';
import { ReminderFakeService } from '../reminder.fake.service';
import { ReminderService } from '../reminder.service';
import { doArraysContainSameValues } from '../common';
import { Reminder } from '../reminder';
import * as json from '../../../../testData.json';

@Component({selector: 'mat-list', template: '<ng-content></ng-content>'})
class MatListStub {
}
@Component({selector: 'mat-list-item', template: '<ng-content></ng-content>'})
class MatListItemStub {
}
@Component({selector: 'mat-icon', template: '<div></div>'})
class MatIcon {
}

describe('ListRemindersComponent', () => {
  let component: ListRemindersComponent;
  let fixture: ComponentFixture<ListRemindersComponent>;
  let fakeService: ReminderFakeService = new ReminderFakeService();
  let testData: Reminder[] = json.Reminder.map(i => {
    return { id: i.id, value: i.value }
  });
  let testData_empty: Reminder[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListRemindersComponent,
        MatListStub,
        MatListItemStub,
        MatIcon
      ],
      providers: [
        { provide: ReminderService, useValue: fakeService }
      ]
    })
    fakeService.fakeData = testData_empty;

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

  it('should render a material list',
    () => {
    const element: HTMLElement = fixture.nativeElement;
    const list = element.querySelector('mat-list');
    expect(list).toBeTruthy();
  });

  it('should render an empty list when storage is empty',
     () => {
    fakeService.fakeData = testData_empty;
    component.ngOnInit();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    expect(remindersListElement).toBeTruthy();
    let listItems = remindersListElement.getElementsByTagName('mat-list-item');
    expect(listItems).toBeTruthy();
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
    fakeService.fakeData = testData;
    component.ngOnInit();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement.querySelector('mat-list')
    let listItems = remindersListElement.querySelectorAll('mat-list-item');
    let listValues: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].textContent)
    }
    let reminderExpectedValues = testData.map(reminder => reminder.value);

    expect(doArraysContainSameValues(reminderExpectedValues, listValues))
      .toBeTruthy();
  });

  it('should render updated list when data changes',
     () => {
    let expectedResult: Reminder[] = [...testData,
      { value:'new reminder' } as Reminder];

    fakeService.fakeData = testData;
    component.ngOnInit();
    fixture.detectChanges();

    fakeService.fakeData = expectedResult;
    fakeService.updateReminders();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    let listItems = remindersListElement.querySelectorAll('mat-list-item');
    let listValues: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].textContent)
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

