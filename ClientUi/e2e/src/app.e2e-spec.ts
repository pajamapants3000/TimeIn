import { by, element } from 'protractor';
import { AppPage } from './app.po';
import { REMINDERS } from '../../src/app/mock-reminders';


describe('workspace-project App', () => {
  let page: AppPage;

// Helpers
let assertRemindersListAsExpected: (expected: string[]) => void = (expected) => {
    let reminders$ = element.all(by.repeater('reminder in reminders')
        .column('reminder.value'));
    reminders$.then(
      (reminders) => {
        expect(reminders).toBeTruthy();
        expect(reminders.length).toBe(expected.length);
        for (let i = 0; i < expected.length; i++) {
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

  it('should display heading message - My Reminders', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('My Reminders');
  });

  it('should display add-reminder component', () => {
    page.navigateTo();
    expect(page.getComponent('add-reminder').isPresent()).toBe(true);
  });

  it('should display list-reminders component', () => {
    page.navigateTo();
    expect(page.getComponent('list-reminders').isPresent()).toBe(true);
  });

  it('should initially list seeded reminders', () => {
    page.navigateTo();
    assertRemindersListAsExpected(REMINDERS);
  });

  it('should update reminders list when reminder is added', () => {
    page.navigateTo();
    let reminderToAdd: string = 'My New Reminder';
    page.submitAddReminder(reminderToAdd);
    let updatedRemindersList = [...REMINDERS, reminderToAdd];

    assertRemindersListAsExpected(updatedRemindersList);
  });

});

