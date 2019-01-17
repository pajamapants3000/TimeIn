import {
  protractor,
  browser,
  by,
  element,
  ElementFinder,
  ElementArrayFinder,
  Key,
  $$,
  $
} from 'protractor';
import { Reminder } from '../../src/app/models/reminder';
import { ScheduledEvent } from '../../src/app/models/scheduled-event';
import { msPerDay, storedUtcDateToDate } from '../../src/app/common';

/* constants */
const reminderTabId: string = "mat-tab-label-0-0";
const scheduledEventTabId: string = "mat-tab-label-0-1";
const addReminderButtonId: string = "addReminderButton";
const addScheduledEventButtonId: string = "addScheduledEventButton";
const addReminderComponentId: string = "app-add-reminder";
const listRemindersComponentId: string = "app-list-reminders";
const listScheduledEventsComponentId: string = "app-list";
const scheduledEventDetailsComponentId: string = "app-scheduled-event-details";
const scheduledEventsComponentId: string = "app-scheduled-events";
const scheduledEventDetailsButtonId: string = "scheduledEvent_{}_details";
const reminderCompleteButtonId: string = "complete_{}";
const reminderUncompleteButtonId: string = "uncomplete_{}";
const cancelScheduledEventEditButtonId: string = "cancelScheduledEventEditButton";
const submitScheduledEventEditButtonId: string = "submitScheduledEventEditButton";
const reminderListCss: string = "app-list-reminders mat-list-item button ~ span";
const reminderButtonListCss: string = "app-list-reminders mat-list-item button";
const addScheduledEventDefaults_name: string = "";
const addScheduledEventDefaults_description: string = "";
const addScheduledEventDefaults_durationInMinutes: number = 60;
const addScheduledEventDefaults_when: Date = new Date(Date.now());
const reminderCompleteButtonText: string = "check_circle";
const reminderUncompleteButtonText: string = "done";

export class AppPage {
  title: ElementFinder;
  reminderTab: ElementFinder;
  addReminderComponent: ElementFinder;
  listRemindersComponent: ElementFinder;
  reminderList: ElementArrayFinder;
  reminderButtonList: ElementArrayFinder;
  scheduledEventTab: ElementFinder;
  scheduledEventsComponent: ElementFinder;
  listScheduledEventsComponent: ElementFinder;
  scheduledEventDetailsComponent: ElementFinder;
  addReminderButton: ElementFinder;
  addScheduledEventButton: ElementFinder;
  scheduledEvents: ElementArrayFinder;
  submitScheduledEventEditButton: ElementFinder =
    $("#submitScheduledEventEditButton");
  cancelScheduledEventEditButton: ElementFinder =
    $("#cancelScheduledEventEditButton");
  scheduledEventList: ElementArrayFinder;
  reminderInput: ElementFinder;
  isScheduledEventTabOpen: boolean;
  isScheduledEventDetailsOpen: boolean;
  scheduledEventNameInput: ElementFinder;
  scheduledEventDescriptionInput: ElementFinder;
  scheduledEventWhenInput: ElementFinder;
  scheduledEventDurationInput: ElementFinder;
  reminderCompleteButtonText: string;
  reminderUncompleteButtonText: string;
  scheduledEventPastCss: string = "scheduled-event-list-item-past";
  scheduledEventFutureCss: string = "scheduled-event-list-item-future";
  addScheduledEventDefault: ScheduledEvent = new ScheduledEvent({
    name: addScheduledEventDefaults_name,
    description: addScheduledEventDefaults_description,
    when: new Date(
      addScheduledEventDefaults_when.getFullYear(),
      addScheduledEventDefaults_when.getMonth(),
      addScheduledEventDefaults_when.getDate(),
      addScheduledEventDefaults_when.getHours(),
      addScheduledEventDefaults_when.getMinutes(),
    ),
    durationInMinutes: addScheduledEventDefaults_durationInMinutes
  });

  constructor() {
    this.title = $("app-root h1");
    this.reminderTab = $("#mat-tab-label-0-0");
    this.addReminderComponent = $("app-add-reminder");
    this.listRemindersComponent = $("app-list-reminders");
    this.reminderList = $$(reminderListCss);
    this.reminderButtonList = $$(reminderButtonListCss);
    this.scheduledEventTab = $("#mat-tab-label-0-1");
    this.scheduledEventsComponent = $("app-scheduled-events");
    this.scheduledEventDetailsComponent = $("app-scheduled-event-details");
    this.listScheduledEventsComponent = $("app-list");
    this.addReminderButton = $("#addReminderButton");
    this.addScheduledEventButton = $("#addScheduledEventButton")
    this.submitScheduledEventEditButton = $("#submitScheduledEventEditButton");
    this.cancelScheduledEventEditButton = $("#cancelScheduledEventEditButton");
    this.scheduledEventList = $$("app-list mat-list-item.scheduled-event-list-item div div[id^='scheduledEvent_'] ");
    this.reminderInput = this.addReminderComponent.$("input");
    this.scheduledEventNameInput = $("#nameInput");
    this.scheduledEventDescriptionInput = $("#descriptionInput");
    this.scheduledEventWhenInput = $("#whenInput");
    this.scheduledEventDurationInput = $("#durationInput");
    this.reminderCompleteButtonText = reminderCompleteButtonText;
    this.reminderUncompleteButtonText = reminderUncompleteButtonText;

  }

  /* methods to keep */
  async navigateTo(): Promise<void> {
    return await browser.get('/');
  }

  reminderCompleteButton(id: number): ElementFinder {
    return $(`#${reminderCompleteButtonId.replace("{}", id.toString())}`);
  }

  reminderUncompleteButton(id: number): ElementFinder {
    return $(`#${reminderUncompleteButtonId.replace("{}", id.toString())}`);
  }

  scheduledEventDetailsButton(id: number): ElementFinder {
    return $(`#${scheduledEventDetailsButtonId.replace("{}", id.toString())}`);
  }

  scheduledEventListItem(id: number): ElementFinder {
    return $(`app-list div.mat-list-item-content #scheduledEvent_${id.toString()}`);
  }

  scheduledEventListItemName(_scheduledEventListItem: ElementFinder): ElementFinder {
    return _scheduledEventListItem.$("div[id^='scheduledEvent_'] > span:nth-of-type(3)");
  }

  scheduledEventListItemWhen(_scheduledEventListItem: ElementFinder): ElementFinder {
    return _scheduledEventListItem.$("div[id^='scheduledEvent_'] > span:nth-of-type(1)");
  }

  scheduledEventListItemDuration(_scheduledEventListItem: ElementFinder): ElementFinder {
    return _scheduledEventListItem.$("div[id^='scheduledEvent_'] > span:nth-of-type(2)");
  }

  async openReminderTab(): Promise<void> {
    await this.reminderTab.click();

    let EC = protractor.ExpectedConditions;
    let isScheduledEventTabHidden = EC.stalenessOf(this.addScheduledEventButton);
    await browser.wait(isScheduledEventTabHidden,
                 3000,
                 "Scheduled Event add button should be off screen.");
  }

  async openScheduledEventTab(): Promise<void> {
    await this.scheduledEventTab.click();

    let EC = protractor.ExpectedConditions;
    let isReminderTabHidden = EC.stalenessOf(this.addReminderButton);
    await browser.wait(isReminderTabHidden,
                       3000,
                       "Reminder add button should be off screen.");
  }

  /* Action methods - perform some imitation of a user interaction */
  async clickButtonById(nameOfButton: string, msToWait: number = 3000): Promise<void> {
    let EC = protractor.ExpectedConditions;
    let button: ElementFinder = element(by.id(nameOfButton));
    let isButtonClickable = EC.elementToBeClickable(button);
    await browser.wait(isButtonClickable,
               msToWait,
               `Expected #${nameOfButton} to become clickable.`)

    await button.click()
  }

  async submitAddReminder(text: string): Promise<void> {
    await this.sendTextToAddReminderInput(text);
    await this.clickButtonById(addReminderButtonId);
  }

  async addScheduledEvent(newScheduledEvent: ScheduledEvent,
                         isSuccessExpected: boolean = true): Promise<void> {
    await this.openScheduledEventTab();
    await this.addScheduledEventButton.click();
    await this.insertScheduledEventDetails(newScheduledEvent);
    await this.submitScheduledEventEdit(isSuccessExpected);
  }

  async updateScheduledEvent(updatedScheduledEvent: ScheduledEvent,
                            isSuccessExpected: boolean = true): Promise<void> {
    await this.openScheduledEventTab();
    await this.scheduledEventDetailsButton(updatedScheduledEvent.id).click();
    await this.insertScheduledEventDetails(updatedScheduledEvent);
    await this.submitScheduledEventEdit(isSuccessExpected);
  }

  async cancelScheduledEventUpdate(updatedScheduledEvent: ScheduledEvent): Promise<void> {
    await this.openScheduledEventTab();
    await this.openScheduledEventDetails(updatedScheduledEvent.id);
    await this.insertScheduledEventDetails(updatedScheduledEvent);
    await this.cancelScheduledEventEdit();
  }

  /* Assertion methods - apply assertions; depend on these to fail loudly */
  async expectCorrectTitleText(expected: string): Promise<void> {
    await expect(this.getTitleText()).toEqual(expected);
  }

  async expectComponentToBePresent(componentName: string): Promise<void> {
    await expect(this.getComponent(componentName).isPresent()).toBe(true);
  }

  async expectComponentToNotBePresent(componentName: string): Promise<void> {
    await expect(this.getComponent(componentName).isPresent()).toBe(false);
  }

  async expectReminderListAccurate(expected: Reminder[]): Promise<void> {
    let reminders = $$(reminderListCss);
    await expect(reminders).toBeTruthy();
    await expect(reminders.count()).toBe(expected.length);
    let listItemCount = await reminders.count()
    for (let i = 0; i < listItemCount; i++) {
      await expect(reminders.get(i).getText()).toBe(expected[i].value);
    }
  }

  // TODO: run with bad info to make sure promises on getText are resolving
  async expectAddScheduledEventDefaultsAccurate(): Promise<void> {
    await this.openAddScheduledEvent();

    let nameInput: ElementFinder = element(by.id("nameInput"));
    let descriptionInput: ElementFinder = element(by.id("descriptionInput"));
    let whenInput: ElementFinder = element(by.id("whenInput"));
    let durationInput: ElementFinder = element(by.id("durationInput"));

    await expect(nameInput.getAttribute("value"))
      .toEqual(addScheduledEventDefaults_name);
    await expect(descriptionInput.getAttribute("value"))
      .toEqual(addScheduledEventDefaults_description);
    let whenValue = await whenInput.getAttribute("value");
    await expect((new Date(whenValue)).valueOf() - msPerDay)
      .not.toBeGreaterThan(addScheduledEventDefaults_when.valueOf());
    await expect((new Date(whenValue)).valueOf() + msPerDay)
      .toBeGreaterThan(addScheduledEventDefaults_when.valueOf());
    await expect(durationInput.getAttribute("value"))
      .toEqual(addScheduledEventDefaults_durationInMinutes.toString());
  }

  async readScheduledEventDetails(): Promise<ScheduledEvent> {
    let result: ScheduledEvent = new ScheduledEvent();

    result.name = await this.scheduledEventNameInput.getAttribute("value");
    result.description = await this.scheduledEventDescriptionInput.getAttribute("value");
    result.when = new Date(await this.scheduledEventWhenInput.getAttribute("value"));
    result.durationInMinutes = +(await this.scheduledEventDurationInput.getAttribute("value"));

    return result;
  }

  async readScheduledEventDisplayInList(id: number): Promise<ScheduledEvent> {
    let result: ScheduledEvent = new ScheduledEvent();

    let listItem: ElementFinder = this.scheduledEventListItem(id);
    result.name = await this.scheduledEventListItemName(listItem).getText();
    result.when = new Date(await this.scheduledEventListItemWhen(listItem)
                           .getText());
    result.durationInMinutes =
      +(await this.scheduledEventListItemDuration(listItem).getText());

    return result;
  }

  // TODO: run with bad info to make sure promises on getText are resolving
  async expectScheduledEventDetailsAccurate(expected: ScheduledEvent): Promise<void> {
    let nameInput: ElementFinder = element(by.id("nameInput"));
    let descriptionInput: ElementFinder = element(by.id("descriptionInput"));
    let whenInput: ElementFinder = element(by.id("whenInput"));
    let durationInput: ElementFinder = element(by.id("durationInput"));

    await expect(await nameInput.getAttribute("value")).toEqual(expected.name);
    await expect(await descriptionInput.getAttribute("value")).toEqual(expected.description);
    let whenValue = await whenInput.getAttribute("value");
    await expect(new Date(whenValue)) .toEqual(expected.when);
    await expect(await durationInput.getAttribute("value"))
      .toEqual(expected.durationInMinutes.toString());
  }

  async expectScheduledEventListOrdered(): Promise<void> {
    let seList: ElementFinder[] = await this.getScheduledEventList();
    await expect(seList.length).toBeGreaterThan(0);
    for (let i = 1; i < seList.length; i++) {
      let previous = await this.getScheduledEventDisplayDataInElement(seList[i-1]);
      let current = await this.getScheduledEventDisplayDataInElement(seList[i-1]);
      await expect(ScheduledEvent.compare(previous, current))
        .not.toBeGreaterThan(0);
    };
  }

  async expectQuantityOfScheduledEventsInListCorrect(expectedQuantity: number): Promise<void> {
    let seList: ElementFinder[] = await this.getScheduledEventList();
    await expect(seList.length).toEqual(expectedQuantity);
  }

  async expectScheduledEventStyled(id: number): Promise<void> {
    let eventElement: ElementFinder = $(`#scheduledEvent_${id}`);
    await expect(eventElement).toBeDefined();
    let seClass = await eventElement.getAttribute("class");
    let se = await this.getScheduledEventDisplayDataInElement(eventElement);
    await expect(seClass).toEqual(this.expectedScheduledEventStyle(se));
  }

  async expectScheduledEventListStyled(): Promise<void> {
    let seList: ElementFinder[] = await this.getScheduledEventList();
      expect(seList.length).toBeGreaterThan(0);
      for (let i = 0; i < seList.length; i++) {
        let se = await this.getScheduledEventDisplayDataInElement(seList[i]);
        let seWrapper: ElementFinder = seList[i].$("div div[id^='scheduledEvent_']");
        let seClass = await seWrapper.getAttribute("class");
        await expect(seClass).toEqual(this.expectedScheduledEventStyle(se));
    }
  }

  async expectScheduledEventListAccurate(expected: ScheduledEvent[]): Promise<void> {
    let seList: ElementFinder[] = await this.getScheduledEventList();
    let listItemCount: number;
    await expect(seList.length).toEqual(expected.length);
    for (let i = 0; i < seList.length; i++) {
      let seWrapper: ElementFinder = seList[i].$("div div[id^='scheduledEvent_']");
      let seId: number;

      let id = await seWrapper.getAttribute("id");
      let _id: string = id.substr("scheduledEvent_".length);
      seId = +_id;

      let se = await this.getScheduledEventDisplayDataInElement(seList[i]);
      let seExpected: ScheduledEvent = expected.find(_se => _se.id == seId);

      await expect(se.name).toEqual(seExpected.name);
      await expect(se.when.valueOf() - msPerDay)
        .not.toBeGreaterThan(seExpected.when.valueOf());
      await expect(se.when.valueOf() + msPerDay)
        .toBeGreaterThan(seExpected.when.valueOf());
      await expect(se.durationInMinutes).toEqual(seExpected.durationInMinutes);
    }
  }

  /* Supporting action methods - actions not called directly by tests */
  async sendTextToAddReminderInput(text: string): Promise<void> {
    let addReminderInput: ElementFinder = this.getAddReminderInput();
    await addReminderInput.sendKeys(text);
  }

  async openAddScheduledEvent(): Promise<void> {
    await this.clickButtonById(addScheduledEventButtonId);
  }

  async openScheduledEventDetails(id: number): Promise<void> {
    await this.clickButtonById(scheduledEventDetailsButtonId.replace("{}", id.toString()));
  }

  async insertScheduledEventDetails(dataToInput: ScheduledEvent): Promise<void> {
    let EC = protractor.ExpectedConditions;
    let isDetailsOpen = EC.presenceOf(this.scheduledEventNameInput);
    await browser.wait(isDetailsOpen,
                       3000,
                       "Details pane should open.");

    await this.scheduledEventNameInput.clear();
    for (let i = 0; i < dataToInput.name.length; i++) {
      await this.scheduledEventNameInput.sendKeys(dataToInput.name[i]);
    }

    await this.scheduledEventDescriptionInput.clear();
    for (let i = 0; i < dataToInput.description.length; i++) {
      await this.scheduledEventDescriptionInput.sendKeys(dataToInput.description[i]);
    }


    await this.scheduledEventWhenInput.clear();
    await this.insertDate(dataToInput.when, this.scheduledEventWhenInput);

    await this.scheduledEventDurationInput.clear();
    await this.scheduledEventDurationInput.sendKeys(dataToInput.durationInMinutes);
  }

  async insertDate(toInsert: Date, inputField: ElementFinder): Promise<void> {
    await inputField.sendKeys(("0" + (toInsert.getMonth() + 1).toString()).slice(-2));
    await inputField.sendKeys(("0" + toInsert.getDate().toString()).slice(-2));
    await inputField.sendKeys(("000" + toInsert.getFullYear().toString()).slice(-4));
    await inputField.sendKeys(Key.TAB)

    // handle both possible ways of modulus being handled for negatives
    let hours: number = ((((toInsert.getHours() - 1) % 12) + 12) % 12) + 1;
    await inputField.sendKeys(("0" + hours.toString()).slice(-2));

    await inputField.sendKeys(("0" + toInsert.getMinutes().toString()).slice(-2));

    if (toInsert.getHours() < 12) {
      await inputField.sendKeys('a');
    } else {
      await inputField.sendKeys('pp'); // not sure why this has to be pressed twice
    }
  }

  formatDetailsDate(when: Date): string {
    let toDisplay: Date = when;

    // current format: yyyy-MM-dd hh:mm aa
    let yearString: string = ("000" + toDisplay.getFullYear().toString()).slice(-4);
    let monthString: string = ("0" + (toDisplay.getMonth() + 1).toString()).slice(-2);
    let dateString: string = ("0" + toDisplay.getDate().toString()).slice(-2);
    let hoursString: string = ("0" + toDisplay.getHours().toString()).slice(-2);
    let minutesString: string = ("0" + toDisplay.getMinutes().toString()).slice(-2);

    return `${yearString}-${monthString}-${dateString}T` +
      `${hoursString}:${minutesString}`;
  }

  formatDisplayDate(when: Date): string {
    let toDisplay: Date = when;
    toDisplay.setSeconds(0);
    toDisplay.setMilliseconds(0);

    // current format: yyyy-MM-dd hh:mm aa
    let yearString: string = ("000" + toDisplay.getFullYear().toString()).slice(-4);
    let monthString: string = ("0" + (toDisplay.getMonth() + 1).toString()).slice(-2);
    let dateString: string = ("0" + toDisplay.getDate().toString()).slice(-2);
    let hours: number = ((((toDisplay.getHours() - 1) % 12) + 12) % 12) + 1;
    let hoursString: string = ("0" + hours.toString()).slice(-2);
    let minutesString: string = ("0" + toDisplay.getMinutes().toString()).slice(-2);
    let ampmString: string;
    if (toDisplay.getHours() < 12) {
      ampmString = "AM";
    } else {
      ampmString = "PM";
    }

    return `${yearString}-${monthString}-${dateString} ` +
      `${hoursString}:${minutesString} ${ampmString}`;
  }

  async submitScheduledEventEdit(isSuccessExpected: boolean = true): Promise<void> {
    await this.submitScheduledEventEditButton.click();

    if (isSuccessExpected) {
      let EC = protractor.ExpectedConditions;
      let isDetailsContainerClickable = EC.elementToBeClickable($("div.mat-drawer-inner-container"));
      await browser.wait(EC.not(isDetailsContainerClickable),
                         3000,
                         "expect details pane container to become unclickable");
    }
  }

  async cancelScheduledEventEdit(): Promise<void> {
    await this.cancelScheduledEventEditButton.click();

    // wait for Scheduled Event details to disappear
    // (otherwise test may rush too fast for subsequent steps)
    // also makes it clear if test fails because pane doesn't close
    let EC = protractor.ExpectedConditions;
    let innerContainer: ElementFinder = $("div.mat-drawer-inner-container");
    let isContainerHidden = EC.not(EC.elementToBeClickable(innerContainer));
    await browser.wait(isContainerHidden,
                       3000,
                       "Expected 'Scheduled Event Details' to hide");
  }

  /* Informational methods - not directly callable by tests */
  async getTitleText(): Promise<string> {
    return await element(by.css('app-root h1')).getText();
  }

  getComponent(componentName: string): ElementFinder {
    return element(by.tagName(componentName));
  }

  getAddReminderInput(): ElementFinder {
    let addReminderComponent: ElementFinder = this.getComponent(addReminderComponentId);
    return addReminderComponent.element(by.tagName('input'));
  }

  getReminderListItemById(id: number): ElementFinder {
    let listRemindersComponent: ElementFinder = this.getComponent(listRemindersComponentId);
    return  listRemindersComponent.element(by.id('reminder_' + id.toString()));
  }

  async getScheduledEventList(): Promise<ElementFinder[]> {
    let listItemCss = "app-list mat-list-item.scheduled-event-list-item";
    let EC = protractor.ExpectedConditions;
    await browser.wait(EC.presenceOf(element(by.css(listItemCss))),
                     3000,
                     "list wait timed out");
    let seList: ElementArrayFinder = $$(listItemCss);
    await expect(await seList.count()).toBeGreaterThan(0);
    return seList;
  }

  // Note: does not populate the full scheduled event; just the basic display
  async getScheduledEventDisplayDataInElement(eventElement: ElementFinder):
    Promise<ScheduledEvent> {

    let result: ScheduledEvent = new ScheduledEvent();
    let name = await this.getScheduledEventName(eventElement);
    result.name = name;
    let duration = await this.getScheduledEventDuration(eventElement);
    result.durationInMinutes = +duration;
    let when = await this.getScheduledEventWhen(eventElement);
    result.when = new Date(when);

    return result;
  }

  async getScheduledEventName(scheduledEventElement: ElementFinder): Promise<string> {
    let seWrapper: ElementFinder = scheduledEventElement
      .$("div div[id^='scheduledEvent_']");
    let dataElements: ElementArrayFinder = seWrapper
      .all(by.tagName("span"));
    return await dataElements.get(2).getText();
  }

  async getScheduledEventDuration(scheduledEventElement: ElementFinder): Promise<string> {
    let seWrapper: ElementFinder = scheduledEventElement
      .$("div div[id^='scheduledEvent_']");
    let dataElements: ElementArrayFinder = seWrapper
      .all(by.tagName("span"));
    return await dataElements.get(1).getText();
  }

  // NOTE: this depends on TypeScript being able to parse the date and time
  // as formatted for the user's display. Not sure how reliable this will be in
  // the long run.
  async getScheduledEventWhen(scheduledEventElement: ElementFinder): Promise<string> {
    let seWrapper: ElementFinder = scheduledEventElement
      .$("div div[id^='scheduledEvent_']");
    let dataElements: ElementArrayFinder = seWrapper
      .all(by.tagName("span"));
    return await dataElements.get(0).getText();
  }

  /* Supporting assertion methods - assertions not called directly by tests */

  /* Supporting methods - reusable code and compartmentalized operations */
  expectedScheduledEventStyle(toTest: ScheduledEvent): string {
    if (toTest.isPast()) {
      return this.scheduledEventPastCss;
    } else {
      return this.scheduledEventFutureCss;
    }
  }

  /* methods to drop
  async completeReminder(id: number): Promise<void> {
    await this.clickButtonById(reminderCompleteButtonId.replace("{}", id.toString()));
  }

  async uncompleteReminder(id: number): Promise<void> {
    await this.clickButtonById(reminderUncompleteButtonId.replace("{}", id.toString()));
  }
  */
}

