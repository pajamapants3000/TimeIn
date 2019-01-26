import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';

import { ListRemindersComponent } from './list-reminders.component';
import { ReminderService } from '../reminder.service';
import { doArraysContainSameValues, click } from '../common';
import { Reminder } from '../models/reminder';
import * as json from '../../../../testData.json';

@Component({selector: 'mat-list', template: '<ng-content></ng-content>'})
class MatListStub { }
@Component({selector: 'mat-list-item', template: '<ng-content></ng-content>'})
class MatListItemStub { }
@Component({selector: 'mat-icon', template: '<div></div>'})
class MatIcon { }

describe('ListRemindersComponent', () => {
  let component: ListRemindersComponent;
  let fixture: ComponentFixture<ListRemindersComponent>;
  let reminderServiceSpy: jasmine.SpyObj<ReminderService>;
  let testData: Reminder[];
  let testData_empty: Reminder[];

  const reminderToAdd: Reminder = new Reminder({
    value: "reminderToAdd",
    isCompleted: false
  });
  const reminderSource: Subject<Reminder[]> = new Subject<Reminder[]>();


  beforeEach(() => {
    let spy = jasmine.createSpyObj("ReminderService", [
      "refreshRemindersList",
      "updateReminder",
      "getReminderSource",
    ]);
    TestBed.configureTestingModule({
      declarations: [
        ListRemindersComponent,
        MatListStub,
        MatListItemStub,
        MatIcon
      ],
      providers: [
        { provide: ReminderService, useValue: spy }
      ]
    })

    testData = json.Reminder.map(i => {return new Reminder().deserialize(i);});
    testData_empty = [];

    reminderServiceSpy = TestBed.get(ReminderService);
    reminderServiceSpy.getReminderSource.and.returnValue(reminderSource);
    reminderServiceSpy.refreshRemindersList.and.returnValue(of());
    reminderServiceSpy.updateReminder.and.returnValue(of());

    fixture = TestBed.createComponent(ListRemindersComponent);
    component = fixture.componentInstance;
  });

  it('should be created',
     () => {
    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
  it('should render h2 heading "Reminders"',
     () => {
    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2.textContent).toEqual('Reminders');
  });
  it('should render a material list',
     () => {
    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('mat-list');
    expect(list).toBeTruthy();
  });
  it('should render an empty list when storage is empty',
     () => {
    component.ngOnInit();
    reminderSource.next(testData_empty);
    fixture.detectChanges();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    expect(remindersListElement).toBeTruthy();
    let listItems = fixture.nativeElement.getElementsByTagName('mat-list-item');
    expect(listItems.length).toEqual(0);
  });
  it('should render ordered list (isCompleted (asc), then is (asc)) when non-empty',
     () => {
    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    let expectedResult: string[] = testData.sort(Reminder.compare)
                                         .map(reminder => reminder.value);

    let listItems = fixture.nativeElement.querySelectorAll('mat-list-item span');
    let listValues: string[] = [];

    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].textContent)
    }

    expect(doArraysContainSameValues(expectedResult, listValues)).toBeTruthy();
  });
  it('should render updated, properly ordered list when data changes',
     () => {
    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    let newData: Reminder[] = [...testData,
                                      new Reminder({ value: 'new reminder' })]
      .sort(Reminder.compare);
    let expectedResult: string[] = newData.map(reminder => reminder.value);

    reminderSource.next(newData);
    fixture.detectChanges();

    let listItems = fixture.nativeElement.querySelectorAll('mat-list-item span');
    let listValues: string[] = [];

    for (let i = 0; i < listItems.length; i++) {
      listValues.push(listItems[i].textContent)
    }

    expect(doArraysContainSameValues(expectedResult, listValues)).toBeTruthy();
   });
  it('should render an button on all list items',
    () => {
      // NOTE: I would like to figure out a way to test the correct icon on
      // completed and incomplete reminders, but haven't figured it out
    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    let listItems = fixture.nativeElement.querySelectorAll('mat-list-item');

    expect(listItems.length).toBeGreaterThan(0); // ensure non-trivial test
    for (let i = 0; i < listItems.length; i++) {
      let button = listItems[i].querySelector('button');
      expect(button).toBeTruthy();
    }
  });
  it('should render text on completed items with reminder-list-item-complete css class',
    () => {
    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    let expectedCssClassName: string = "reminder-list-item-complete";

    let completeIds: string[] = testData
      .filter(i => i.isCompleted)
      .map(i => `reminder_${i.id}`);

    expect(completeIds.length).toBeGreaterThan(0); // ensure non-trivial test
    for (let i = 0; i < completeIds.length; i++) {
      let completedItem = fixture.nativeElement.querySelector(`#${completeIds[i]}`);
      expect(completedItem.className).toEqual(expectedCssClassName);
    }
  });
  it('should render text on non-completed items with reminder-list-item-incomplete css class',
    () => {
    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    let expectedCssClassName: string = "reminder-list-item-incomplete";

    let incompleteIds: string[] = testData.filter(i => !i.isCompleted).map(i => `reminder_${i.id}`);

    expect(incompleteIds.length).toBeGreaterThan(0); // ensure non-trivial test
    for (let i = 0; i < incompleteIds.length; i++) {
      let incompletedItem = fixture.nativeElement.querySelector(`#${incompleteIds[i]}`);
      expect(incompletedItem.className).toEqual(expectedCssClassName);
    }
  });
  it('should call service method updateReminder with isCompleted true when button clicked on incomplete reminders',
    () => {
    const idToClick: number = 2;
    testData[idToClick].isCompleted = false;
    let expected: Reminder = new Reminder({
      id: idToClick,
      value: null,
      isCompleted: true
    });

    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    reminderServiceSpy.updateReminder.calls.reset();

    let listItem = fixture.nativeElement.querySelector(`#reminder_${idToClick}`);
    let completeButton = listItem.querySelector("button");

    click(completeButton);

    expect(reminderServiceSpy.updateReminder).toHaveBeenCalledWith(expected);
  });
  it('should call service method updateReminder with isCompleted false when button clicked on completed reminders',
    () => {
    const idToClick: number = 3;
    testData[idToClick].isCompleted = true;
    let expected: Reminder = new Reminder({
      id: idToClick,
      value: null,
      isCompleted: false
    });

    component.ngOnInit();
    reminderSource.next(testData);
    fixture.detectChanges();

    reminderServiceSpy.updateReminder.calls.reset();

    let remindersListElement: HTMLElement = fixture.nativeElement
                                              .querySelector('mat-list')
    let listItems = remindersListElement.querySelector(`#reminder_${idToClick}`);
    let completeButton = listItems.querySelector("button");

    click(completeButton);

    expect(reminderServiceSpy.updateReminder).toHaveBeenCalledWith(expected);
  });
});

