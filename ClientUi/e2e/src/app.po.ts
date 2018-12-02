import { browser, by, element, ElementFinder, Key } from 'protractor';

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
    let addReminderComponent: ElementFinder = this.getComponent('add-reminder');
    return addReminderComponent.element(by.exactBinding('newReminder'));
  }

  getAddReminderSubmitButton(): ElementFinder {
    let addReminderComponent: ElementFinder = this.getComponent('add-reminder');
    return addReminderComponent.element(by.buttonText('Add'));
  }

  sendTextToAddReminderInput(text: string): void {
    let addReminderInput: ElementFinder = this.getAddReminderInput();
    addReminderInput.sendKeys(text);
  }

  submitAddReminder(text: string): void {
    this.sendTextToAddReminderInput(text);
    let submitButton: ElementFinder = this.getAddReminderSubmitButton();
    submitButton.click();
  }
}
