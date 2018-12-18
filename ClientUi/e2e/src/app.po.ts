import { browser, by, element, ElementFinder, Key } from 'protractor';
import { Reminder } from '../../src/app/reminder';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText();
  }

  getComponent(componentName: string): ElementFinder {
    return element(by.tagName(componentName));
  }

  getAddReminderInput(): ElementFinder {
    let addReminderComponent: ElementFinder = this.getComponent('app-add-reminder');
    return addReminderComponent.element(by.tagName('input'));
  }

  getAddReminderSubmitButton(): ElementFinder {
    let addReminderComponent: ElementFinder = this.getComponent('app-add-reminder');
    return addReminderComponent.element(by.buttonText('Add'));
  }

  getReminderListItemById(id: number): ElementFinder {
    let listRemindersComponent: ElementFinder = this.getComponent('app-list-reminders');
    return  listRemindersComponent.element(by.id('reminder_' + id.toString()));
  }

  sendTextToAddReminderInput(text: string): void {
    let addReminderInput: ElementFinder = this.getAddReminderInput();
    addReminderInput.sendKeys(text);
  }

  submitAddReminder(text: string): void {
    this.sendTextToAddReminderInput(text);
    let submitButton: ElementFinder = this.getAddReminderSubmitButton();
    submitButton.click();
    // first API publish seems to cause failure to wait for full page load
    // trigger another one with no additional update to ensure correct result
    submitButton.click();
  }

  completeReminder(id: number): void {
    let reminderToComplete: ElementFinder = this.getReminderListItemById(id);
    let button: ElementFinder = reminderToComplete
                                          .element(by.tagName('button'));
    button.click();
    // first API publish seems to cause failure to wait for full page load
    // trigger another one with no additional update to ensure correct result
    this.getAddReminderInput().clear().then(() =>
      this.getAddReminderSubmitButton().click()
                                           );
  }

  uncompleteReminder(id: number): void {
    let reminderToComplete: ElementFinder = this.getReminderListItemById(id);
    let button: ElementFinder = reminderToComplete
                                          .element(by.tagName('button'));
    button.click();
    // first API publish seems to cause failure to wait for full page load
    // trigger another one with no additional update to ensure correct result
    this.getAddReminderInput().clear().then(() =>
      this.getAddReminderSubmitButton().click()
                                           );
  }
}

