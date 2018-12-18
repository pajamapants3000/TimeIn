import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRemindersComponent } from './list-reminders.component';
import { ReminderFakeService } from '../reminder.fake.service';
import { ReminderService } from '../reminder.service';
import { doArraysContainSameValues, reminderCompare, click } from '../common';
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
  let testData: Reminder[];
  let testData_empty: Reminder[];

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

    // NOTE: data gets sorted in NgOnInit
    testData = json.Reminder.map(i => {
      return { id: i.id, value: i.value, isCompleted: i.isCompleted }
    });
    testData_empty = [];

    fakeService.fakeData = testData_empty;
    fakeService.resetCalls();

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
    expect(listItems.length).toEqual(0);
  });

  it('should render ordered list (isCompleted (asc), then is (asc)) when non-empty',
     () => {
    fakeService.fakeData = testData
    component.ngOnInit();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement.querySelector('mat-list')
    let listItems = remindersListElement.querySelectorAll('mat-list-item span');
    let listValues: string[] = [];

    expect(listItems.length).toBeGreaterThan(0);

    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].textContent)
    }
    let reminderExpectedValues = testData.sort(reminderCompare)
                                         .map(reminder => reminder.value);

    expect(doArraysContainSameValues(reminderExpectedValues, listValues))
      .toBeTruthy();
    // help avoid trivial passes
    expect(doArraysContainSameValues(
      testData.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        if (a.id == b.id) return 0;
      }).map(reminder => reminder.value),
      listValues)).toBeFalsy();
  });

  it('should render updated, properly ordered list when data changes',
     () => {
    let expectedResult: Reminder[] = [...testData,
      { value:'new reminder' } as Reminder].sort(reminderCompare);

    fakeService.fakeData = testData;
    component.ngOnInit();
    fixture.detectChanges();

    fakeService.fakeData = expectedResult;
    fakeService.refreshRemindersList();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    let listItems = remindersListElement.querySelectorAll('mat-list-item span');
    let listValues: string[] = [];

    expect(listItems.length).toBeGreaterThan(0);
    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].textContent)
    }
    let reminderExpectedValues = expectedResult.map(reminder => reminder.value);

    expect(doArraysContainSameValues(reminderExpectedValues, listValues))
      .toBeTruthy();
    expect(doArraysContainSameValues(
      expectedResult.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        if (a.id == b.id) return 0;
      }).map(reminder => reminder.value),
      listValues)).toBeFalsy();
   });

  it('should render an button on all list items',
    () => {
    fakeService.fakeData = testData;
    component.ngOnInit();
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    let listItems = remindersListElement.querySelectorAll('mat-list-item');
    expect(listItems.length).toBeGreaterThan(0);
    for (let i = 0; i < listItems.length; i++) {
      let button = listItems[i].querySelector('button');
      expect(button).toBeTruthy();
    }
  });

  it('should render text on completed items with reminder-list-item-complete css class',
    () => {
    fakeService.fakeData = testData;
    component.ngOnInit();
    fixture.detectChanges();

    let expectedCssClassName: string = "reminder-list-item-complete";

    let completeIds: string[] = testData.filter(i => i.isCompleted).map(i => `reminder_${i.id}`);

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    expect(completeIds.length).toBeGreaterThan(0);
    for (let i = 0; i < completeIds.length; i++) {
      let completedItem = remindersListElement.querySelector(`#${completeIds[i]}`);
      expect(completedItem.className).toEqual(expectedCssClassName);
    }
  });

  it('should render text on non-completed items with reminder-list-item-incomplete css class',
    () => {
    fakeService.fakeData = testData;
    component.ngOnInit();
    fixture.detectChanges();

    let expectedCssClassName: string = "reminder-list-item-incomplete";

    let incompleteIds: string[] = testData.filter(i => !i.isCompleted).map(i => `reminder_${i.id}`);

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    expect(incompleteIds.length).toBeGreaterThan(0);
    for (let i = 0; i < incompleteIds.length; i++) {
      let incompletedItem = remindersListElement.querySelector(`#${incompleteIds[i]}`);
      expect(incompletedItem.className).toEqual(expectedCssClassName);
    }
  });

  it('should call service method updateReminder with isCompleted true when button clicked on incomplete reminders',
    () => {
    const idToClick: number = 2;
    testData[idToClick].isCompleted = false;

    fakeService.fakeData = testData;
    component.ngOnInit();
    fixture.detectChanges();

    expect(fakeService.memberCalls.get("updateReminder").length).toEqual(0);

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    let listItems = remindersListElement.querySelector(`#reminder_${idToClick}`);
    let completeButton = listItems.querySelector("button");

    click(completeButton);

    expect(fakeService.memberCalls.get("updateReminder").length).toEqual(1);
    expect(fakeService.memberCalls.get("updateReminder")[0][0].id).toEqual(idToClick);
    expect(fakeService.memberCalls.get("updateReminder")[0][0].value).toBeNull();
    expect(fakeService.memberCalls.get("updateReminder")[0][0].isCompleted).toBeTruthy();
  });

  it('should call service method updateReminder with isCompleted false when button clicked on completed reminders',
    () => {
    const idToClick: number = 3;
    testData[idToClick].isCompleted = true;

    fakeService.fakeData = testData;
    component.ngOnInit();
    fixture.detectChanges();

    expect(fakeService.memberCalls.get("updateReminder").length).toEqual(0);

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    let listItems = remindersListElement.querySelector(`#reminder_${idToClick}`);
    let completeButton = listItems.querySelector("button");

    click(completeButton);

    expect(fakeService.memberCalls.get("updateReminder").length).toEqual(1);
    expect(fakeService.memberCalls.get("updateReminder")[0][0].id).toEqual(idToClick);
    expect(fakeService.memberCalls.get("updateReminder")[0][0].value).toBeNull();
    expect(fakeService.memberCalls.get("updateReminder")[0][0].isCompleted).toBeFalsy();
  });

  /* Class-related tests */
  it('should call service method refreshRemindersList in ngOnInit',
     () => {
    expect(fakeService.memberCalls.get("refreshRemindersList").length).toEqual(0);
    component.ngOnInit();
    expect(fakeService.memberCalls.get("refreshRemindersList").length).toEqual(1);
  });
});

