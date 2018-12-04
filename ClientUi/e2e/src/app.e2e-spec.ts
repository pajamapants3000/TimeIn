import { by, element } from 'protractor';
import { AppPage } from './app.po';
import { REMINDERS } from '../../src/app/mock-reminders';


describe('TimeIn ClientUi', () => {
  let page: AppPage;

// Helpers
let assertRemindersListAsExpected: (expected: string[]) => void = (expected) => {
    element.all(by.css('.reminders-list li')).then(
      (reminders) => {
        expect(reminders).toBeTruthy();
        expect(reminders.length).toBe(expected.length);
        for (let i = 0; i < reminders.length; i++) {
          expect(reminders[i].getText()).toBe(expected[i]);
        }
      },
      (err) => {
        fail(`retrieval of reminders list failed: ${err}`);
    });
}
// end Helpers

  beforeEach(() => {
    page = new AppPage();
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

  it('should initially list seeded reminders', () => {
    page.navigateTo();
    assertRemindersListAsExpected(REMINDERS.map(rem => rem.value));
  });

  it('should update reminders list when reminder is added', () => {
    page.navigateTo();
    let reminderToAdd: string = 'My New Reminder';
    page.submitAddReminder(reminderToAdd);
    let updatedRemindersList = [...REMINDERS.map(rem => rem.value), reminderToAdd];

    assertRemindersListAsExpected(updatedRemindersList);
  });

});

