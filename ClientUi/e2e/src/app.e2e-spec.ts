import { by, element } from 'protractor';
import { AppPage } from './app.po';
import { Reminder } from '../../src/app/reminder';
import { reminderCompare } from '../../src/app/common';
import * as json from '../../../testData.json';


describe('TimeIn ClientUi', () => {
  let page: AppPage;
  let testData = json.Reminder.map(i => {
    return { id: +i.id, value: i.value, isCompleted: i.isCompleted }
  });
  let testData_empty: Reminder[];

// Helpers
let assertRemindersListAsExpected: (expected: Reminder[]) => void = (expected) => {
    element.all(by.css('mat-list-item button ~ span')).then(
      (reminders) => {
        expect(reminders).toBeTruthy();
        expect(reminders.length).toBe(expected.length);
        for (let i = 0; i < reminders.length; i++) {
          expect(reminders[i].getText()).toBe(expected[i].value);
        }
      },
      (err) => {
        fail(`retrieval of reminders list failed: ${err}`);
    });
}
// end Helpers

  beforeEach(() => {
    page = new AppPage();
    testData_empty = [];
  });

  it('should display heading message - Welcome to TimeIn!', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Welcome to TimeIn!');
  });

  it('should display add-reminder component', () => {
    page.navigateTo();
    expect(page.getComponent('app-add-reminder').isPresent()).toBe(true);
  });

  it('should display list-reminders component', () => {
    page.navigateTo();
    expect(page.getComponent('app-list-reminders').isPresent()).toBe(true);
  });

  it('should initially list seeded reminders, ordered by isCompleted (asc), id (asc)', () => {
    page.navigateTo();
    assertRemindersListAsExpected(testData.sort(reminderCompare));
  });

  it('should update reminders list when reminder is added', () => {
    page.navigateTo();
    let reminderToAdd: Reminder = {
      id: (testData.length + 1),
      value: 'My New Reminder',
      isCompleted: false
    } as Reminder;
    page.submitAddReminder(reminderToAdd.value);
    // update testData for this and subsequent tests
    testData = [...testData, reminderToAdd]
    let updatedReminderValuesList = testData.sort(reminderCompare);

    assertRemindersListAsExpected(updatedReminderValuesList);
  });

  it('should update reminders list when reminder is completed', () => {
    page.navigateTo();
    let reminderId: number = 2;
    // confirm pre-condition - depends on properly initialized test data
    expect(testData.find(x => x.id == reminderId).isCompleted).toBeFalsy()

    page.completeReminder(reminderId);

    let updatedReminder: Reminder = testData.find(x => x.id == reminderId);
    updatedReminder.isCompleted = true;

    let updatedReminderValuesList = testData.sort(reminderCompare);
    assertRemindersListAsExpected(updatedReminderValuesList);
  });

  it('should update reminders list when reminder is un-completed', () => {
    page.navigateTo();
    let reminderId: number = 3;
    // confirm pre-condition - depends on properly initialized test data
    expect(testData.find(x => x.id == reminderId).isCompleted).toBeTruthy()

    page.uncompleteReminder(reminderId);

    let updatedReminder: Reminder = testData.find(x => x.id == reminderId);
    updatedReminder.isCompleted = false;

    let updatedReminderValuesList = testData.sort(reminderCompare);
    assertRemindersListAsExpected(updatedReminderValuesList);
  });

});

