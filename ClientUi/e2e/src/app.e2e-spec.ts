// DON'T FORGET!
// initial testing on localhost; full testing at timein.lilu-windxpro

import {
  by,
  element,
  protractor,
  browser,
  ElementFinder,
  $,
  $$
} from 'protractor';
import { AppPage } from './app.po';
import { Reminder } from '../../src/app/models/reminder';
import { ScheduledEvent } from '../../src/app/models/scheduled-event';
import { AppComponent } from '../../src/app/app.component';
import { msPerDay, msPerHour, msPerMinute, storedUtcDateToDate } from '../../src/app/common';
import * as json from '../../../testData.json';

describe('TimeIn ClientUi', () => {
  if (AppComponent.useInMemoryWebApi) {
    console.log("Running tests with useInMemoryWebApi set.");
  }

  let page: AppPage;
  let testData_reminders_empty: Reminder[];
  let testData_reminders = json.Reminder.map(i => {
    return new Reminder({
      id: i.id,
      value: i.value,
      isCompleted: i.isCompleted
    });
  });

  let testData_scheduledEvents_empty: ScheduledEvent[];
  let testData_scheduledEvents = json.ScheduledEvent.map(i => {
    return new ScheduledEvent({
      id: i.id,
      description: i.description,
      name: i.name,
      when: storedUtcDateToDate(new Date(i.when)),
      durationInMinutes: i.durationInMinutes
    });
  });

  let now: Date = new Date(Date.now());
  now.setSeconds(0);
  now.setMilliseconds(0);
  let testScheduledEvent: ScheduledEvent = new ScheduledEvent({
    id: testData_scheduledEvents.length + 1,
    name: "New Event",
    description: "New event description.",
    when: now,
    durationInMinutes: 60
  });
  let pastWhen: Date;
  let lowerLimitWhen: Date;
  let belowLowerLimitWhen: Date;
  let upperLimitWhen: Date;
  let aboveUpperLimitWhen: Date;
  let futureWhen: Date;
  let sameName: string = "Same name";
  let sameDuration: number = 12345;
  let testIndex: number = 0;
  let minuteModulus: number = 20;
  let durationModulus: number = 37;


  beforeEach(() => {
    page = new AppPage();
    testData_reminders_empty = [];

    pastWhen = new Date(Date.now() - msPerDay);
    pastWhen.setSeconds(0);
    pastWhen.setMilliseconds(0);
    futureWhen = new Date(Date.now() + msPerDay);
    futureWhen.setSeconds(0);
    futureWhen.setMilliseconds(0);
    upperLimitWhen = new Date(2079, 5, 5, 12);
    lowerLimitWhen = new Date(1900, 0, 1, 12);
    belowLowerLimitWhen = new Date(1899, 11, 31, 12);
    aboveUpperLimitWhen = new Date(2079, 5, 7, 12);

    if (AppComponent.useInMemoryWebApi) {
      testData_reminders = json.Reminder.map(i => {
        return new Reminder({
          id: i.id,
          value: i.value,
          isCompleted: i.isCompleted
        });
      });

      testData_scheduledEvents = json.ScheduledEvent.map(i => {
        return new ScheduledEvent({
          id: i.id,
          name: i.name,
          description: i.description,
          when: new Date(i.when),
          durationInMinutes: i.durationInMinutes
        });
      });
    }

    testIndex++;
  });

  /* Main */
  it('should display heading message - Welcome to TimeIn!', async () => {
    await page.navigateTo();

    expect(await page.title.getText()).toEqual('Welcome to TimeIn!');
  });

  /* Reminder */
  it('should display add-reminder component', async () => {
    await page.navigateTo();

    await expect(await page.addReminderComponent.isPresent()).toBe(true);
  });
  it('should display add-reminder component' +
     ' after changing tabs Scheduled Events back to To-Do', async () => {
    await page.navigateTo();
    await page.openScheduledEventTab();
    await page.openReminderTab();

    await expect(await page.addReminderComponent.isPresent()).toBe(true);
  });
  it('should display list-reminders component', async () => {
    await page.navigateTo();

    await expect(await page.listRemindersComponent.isPresent()).toBe(true);
  });
  it('should display list-reminders component' +
     ' after changing tabs Scheduled Events back to To-Do', async () => {
    await page.navigateTo();

    await page.openScheduledEventTab();
    await page.openReminderTab();

    await expect(await page.listRemindersComponent.isPresent()).toBe(true);
  });
  it('should initially list seeded reminders, ordered by isCompleted (asc), id (asc)',
     async () => {
    await page.navigateTo();

    let expected: Reminder[] = testData_reminders.sort(Reminder.compare);

    for (let i = 0; i < testData_reminders.length; i++) {
      await expect(await page.reminderList.get(i).getText())
        .toEqual(expected[i].value);
    }
  });
  it('should list seeded reminders, ordered by isCompleted (asc), id (asc)' +
     ' after changing tabs Scheduled Events back to To-Do', async () => {
    await page.navigateTo();

    await page.openScheduledEventTab();
    await page.openReminderTab();

    let expected: Reminder[] = testData_reminders.sort(Reminder.compare);

    for (let i = 0; i < testData_reminders.length; i++) {
      await expect(await page.reminderList.get(i).getText())
        .toEqual(expected[i].value);
    }
  });
  it('should update reminders list when reminder is added', async () => {
    await page.navigateTo();

    let reminderToAdd: Reminder = {
      id: (testData_reminders.length + 1),
      value: 'My New Reminder',
      isCompleted: false
    } as Reminder;

    await page.reminderInput.sendKeys(reminderToAdd.value);
    await page.addReminderButton.click();

    testData_reminders = [...testData_reminders, reminderToAdd]
    let updatedReminderValuesList = testData_reminders.sort(Reminder.compare);
    let newReminderIndex = updatedReminderValuesList
      .findIndex(x => x.id == reminderToAdd.id);

    await expect(await page.reminderList.get(newReminderIndex).getText())
      .toEqual(reminderToAdd.value);
  });
  it('should update reminders list when reminder is added' +
     ' after changing tabs Scheduled Events back to To-Do', async () => {
    await page.navigateTo();

    await page.openScheduledEventTab();
    await page.openReminderTab();

    let reminderToAdd: Reminder = {
      id: (testData_reminders.length + 1),
      value: 'My New Reminder',
      isCompleted: false
    } as Reminder;

    await page.reminderInput.sendKeys(reminderToAdd.value);
    await page.addReminderButton.click();

    testData_reminders = [...testData_reminders, reminderToAdd]
    let updatedReminderValuesList = testData_reminders.sort(Reminder.compare);
    let newReminderIndex = updatedReminderValuesList
      .findIndex(x => x.id == reminderToAdd.id);

    await expect(await page.reminderList.get(newReminderIndex).getText())
      .toEqual(reminderToAdd.value);
  });
  it('should update reminders list when reminder is completed', async () => {
    await page.navigateTo();

    let reminderId: number = testData_reminders.find(x => !x.isCompleted).id;

    await page.reminderCompleteButton(reminderId).click();

    let updatedReminder: Reminder = testData_reminders.find(x => x.id == reminderId);
    updatedReminder.isCompleted = true;

    let updatedReminderValuesList = testData_reminders.sort(Reminder.compare);
    let index = updatedReminderValuesList.findIndex(x => x.id == reminderId);

    await expect(await page.reminderList.get(index).getText())
      .toEqual(updatedReminder.value);
    await expect(await page.reminderButtonList.get(index).getText())
      .toEqual(page.reminderUncompleteButtonText);
  });
  it('should update reminders list when reminder is completed' +
     ' after changing tabs Scheduled Events back to To-Do', async () => {
    await page.navigateTo();

    await page.openScheduledEventTab();
    await page.openReminderTab();

    let reminderId: number = testData_reminders.find(x => !x.isCompleted).id;

    await page.reminderCompleteButton(reminderId).click();

    let updatedReminder: Reminder = testData_reminders.find(x => x.id == reminderId);
    updatedReminder.isCompleted = true;

    let updatedReminderValuesList = testData_reminders.sort(Reminder.compare);
    let index = updatedReminderValuesList.findIndex(x => x.id == reminderId);

    await expect(await page.reminderList.get(index).getText())
      .toEqual(updatedReminder.value);
    await expect(await page.reminderButtonList.get(index).getText())
      .toEqual(page.reminderUncompleteButtonText);
  });
  it('should update reminders list when reminder is un-completed',
     async () => {
    await page.navigateTo();

    let reminderId: number = testData_reminders.find(x => x.isCompleted).id;

    await page.reminderUncompleteButton(reminderId).click();

    let updatedReminder: Reminder = testData_reminders.find(x => x.id == reminderId);
    updatedReminder.isCompleted = false;

    let updatedReminderValuesList = testData_reminders.sort(Reminder.compare);
    let index = updatedReminderValuesList.findIndex(x => x.id == reminderId);

    await expect(await page.reminderList.get(index).getText())
      .toEqual(updatedReminder.value);
    await expect(await page.reminderButtonList.get(index).getText())
      .toEqual(page.reminderCompleteButtonText);
  });
  it('should update reminders list when reminder is un-completed' +
     ' after changing tabs Scheduled Events back to To-Do', async () => {
    await page.navigateTo();

    await page.openScheduledEventTab();
    await page.openReminderTab();

    let reminderId: number = testData_reminders.find(x => x.isCompleted).id;

    await page.reminderUncompleteButton(reminderId).click();

    let updatedReminder: Reminder = testData_reminders.find(x => x.id == reminderId);
    updatedReminder.isCompleted = false;

    let updatedReminderValuesList = testData_reminders.sort(Reminder.compare);
    let index = updatedReminderValuesList.findIndex(x => x.id == reminderId);

    await expect(await page.reminderList.get(index).getText())
      .toEqual(updatedReminder.value);
    await expect(await page.reminderButtonList.get(index).getText())
      .toEqual(page.reminderCompleteButtonText);
  });

  /* ScheduledEvent */
  it('should render correct initial list with correct styling ',
    async () => {
    await page.navigateTo();

    await page.openScheduledEventTab();

    let expected: ScheduledEvent[] = testData_scheduledEvents
      .sort(ScheduledEvent.compare);

    for (let i = 0; i < expected.length; i++) {
      let listItem = await page.scheduledEventList.get(i);

      await expect(await listItem.getAttribute("id"))
        .toEqual(`scheduledEvent_${expected[i].id.toString()}`);

      await expect(await listItem.getAttribute("class"))
        .toEqual(expected[i].isPast() ?
                 page.scheduledEventPastCss :
                 page.scheduledEventFutureCss)

      await expect(await page.scheduledEventListItemName(listItem).getText())
        .toEqual(expected[i].name);
      await expect(await page.scheduledEventListItemWhen(listItem).getText())
        .toEqual(page.formatDisplayDate(expected[i].when));
      await expect(await page.scheduledEventListItemDuration(listItem).getText())
        .toEqual(expected[i].durationInMinutes.toString());
    }
  });

  /*** Add Scheduled Event - Confirm Style ***/
  let test_addScheduledEvent_confirmStyle_name =
    'should render new scheduled event with correct styling';
  let test_addScheduledEvent_confirmStyle_fn =
    async (newScheduledEvent: ScheduledEvent): Promise<void> => {
      newScheduledEvent.when = new Date(newScheduledEvent.when.valueOf() +
                                        ((msPerMinute * testIndex) % minuteModulus));
      newScheduledEvent.durationInMinutes += (msPerMinute * testIndex) % durationModulus;

      await page.navigateTo();

      await page.addScheduledEvent(newScheduledEvent);

      testData_scheduledEvents = [...testData_scheduledEvents, newScheduledEvent];

      // TODO: I'd like to be able to test the newly added item without having
      // to force a reload, but it's very inconsistent. This, at least, confirms
      // the item was added and is being rendered correctly, even if it isn't
      // proving that the new item shows immediately.
      await page.navigateTo();
      await page.openScheduledEventTab();
      //

      await expect(await page.scheduledEventListItem(newScheduledEvent.id)
        .getAttribute("class"))
        .toEqual(page.expectedScheduledEventStyle(newScheduledEvent));
  };
  it(test_addScheduledEvent_confirmStyle_name +
     ' - new event is unique, future',
     async () => {
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(futureWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });
    await test_addScheduledEvent_confirmStyle_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmStyle_name +
     ' - new event is unique, past',
     async () => {
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(pastWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });
    await test_addScheduledEvent_confirmStyle_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmStyle_name +
     ' - new event has same `when` as existing, future',
     async () => {
    let eventToCopy = testData_scheduledEvents.find(x => !x.isPast());
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmStyle_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmStyle_name +
     ' - new event has same `when` as existing, past',
     async () => {
    let eventToCopy = testData_scheduledEvents.find(x => x.isPast());
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmStyle_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmStyle_name +
     ' - new event has same `when` and duration as existing, future',
     async () => {
    let eventToCopy = testData_scheduledEvents.find(x => !x.isPast());
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToCopy.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmStyle_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmStyle_name +
     ' - new event has same `when` and duration as existing, past',
     async () => {
    let eventToCopy = testData_scheduledEvents.find(x => x.isPast());
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToCopy.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmStyle_fn(newScheduledEvent);
  });

  /*** Add Scheduled Event - Confirm Index ***/
  let test_addScheduledEvent_confirmIndex_name: string =
    'should render new scheduled event at correct index';
  let test_addScheduledEvent_confirmIndex_fn =
    async (newScheduledEvent: ScheduledEvent): Promise<void> => {
      newScheduledEvent.when = new Date(newScheduledEvent.when.valueOf() +
                                        ((msPerMinute * testIndex) % minuteModulus));
      newScheduledEvent.durationInMinutes += (msPerMinute * testIndex) % durationModulus;

      await page.navigateTo();

      await page.addScheduledEvent(newScheduledEvent);

      testData_scheduledEvents = [...testData_scheduledEvents, newScheduledEvent];

      // TODO: I'd like to be able to test the newly added item without having
      // to force a reload, but it's very inconsistent. This, at least, confirms
      // the item was added and is being rendered correctly, even if it isn't
      // proving that the new item shows immediately.
      await page.navigateTo();
      await page.openScheduledEventTab();
      //

      let expectedList = testData_scheduledEvents.sort(ScheduledEvent.compare);
      let expectedIndex = expectedList 
        .findIndex(x => x.id == newScheduledEvent.id);
      let displayedAtIndex = page.scheduledEventList.get(expectedIndex); 

      await expect(await displayedAtIndex.getAttribute("id"))
        .toEqual(`scheduledEvent_${newScheduledEvent.id.toString()}`);
  };
  it(test_addScheduledEvent_confirmIndex_name +
    ' - new event is unique, future', async () => {
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name + ": test_addScheduledEvent_confirmIndex_name_01",
      description: testScheduledEvent.description,
      when: new Date(futureWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmIndex_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmIndex_name +
    ' - new event is unique, past', async () => {
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name + ": test_addScheduledEvent_confirmIndex_name_02",
      description: testScheduledEvent.description,
      when: new Date(pastWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmIndex_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmIndex_name +
    ' - new event has same `when` as existing, future', async () => {
    let eventToCopy = testData_scheduledEvents.find(x => !x.isPast());

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name + ": test_addScheduledEvent_confirmIndex_name_03",
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmIndex_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmIndex_name +
    ' - new event has same `when` as existing, past', async () => {
    let eventToCopy = testData_scheduledEvents.find(x => x.isPast());

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name + ": test_addScheduledEvent_confirmIndex_name_04",
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmIndex_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmIndex_name +
    ' - new event has same `when` and duration as existing, future', async () => {
    let eventToCopy = testData_scheduledEvents.find(x => !x.isPast());

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name + ": test_addScheduledEvent_confirmIndex_name_05",
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToCopy.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmIndex_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmIndex_name +
    ' - new event has same `when` and duration as existing, past', async () => {
    let eventToCopy = testData_scheduledEvents.find(x => x.isPast());

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name + ": test_addScheduledEvent_confirmIndex_name_06",
      description: testData_scheduledEvents[0].description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToCopy.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmIndex_fn(newScheduledEvent);
  });
  /*^^^^^^^^^^^^^^^^^^^^^*/

  /*** Add Scheduled Event - Confirm Data ***/
  let test_addScheduledEvent_confirmData_name: string =
    'should render new scheduled event with correct data';
  let test_addScheduledEvent_confirmData_fn =
    async (newScheduledEvent: ScheduledEvent) => {
      newScheduledEvent.when = new Date(newScheduledEvent.when.valueOf() +
                                        ((msPerMinute * testIndex) % minuteModulus));
      newScheduledEvent.durationInMinutes += (msPerMinute * testIndex) % durationModulus;

      await page.navigateTo();

      await page.addScheduledEvent(newScheduledEvent);

      testData_scheduledEvents = [...testData_scheduledEvents, newScheduledEvent];

      // TODO: I'd like to be able to test the newly added item without having
      // to force a reload, but it's very inconsistent. This, at least, confirms
      // the item was added and is being rendered correctly, even if it isn't
      // proving that the new item shows immediately.
      await page.navigateTo();
      await page.openScheduledEventTab();
      //

      let newScheduledEventItem: ElementFinder = page.scheduledEventListItem(newScheduledEvent.id);

      await expect(await page.scheduledEventListItemName(newScheduledEventItem)
                   .getText())
        .toEqual(newScheduledEvent.name);
      await expect(await page.scheduledEventListItemWhen(newScheduledEventItem)
                   .getText())
        .toEqual(page.formatDisplayDate(newScheduledEvent.when));
      await expect(await page.scheduledEventListItemDuration(newScheduledEventItem)
                   .getText())
        .toEqual(newScheduledEvent.durationInMinutes.toString());
  }
  it(test_addScheduledEvent_confirmData_name +
    ' - new event is unique, future', async () => {
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(futureWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmData_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmData_name +
    ' - new event is unique, past', async () => {
    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(pastWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmData_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmData_name +
    ' - new event has same `when` as existing, future', async () => {
    let eventToCopy = testData_scheduledEvents.find(x => !x.isPast());

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmData_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmData_name +
    ' - new event has same `when` as existing, past', async () => {
    let eventToCopy = testData_scheduledEvents.find(x => x.isPast());

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmData_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmData_name +
    ' - new event has same `when` and duration as existing, future', async () => {
    let eventToCopy = testData_scheduledEvents.find(x => !x.isPast());

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToCopy.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmData_fn(newScheduledEvent);
  });
  it(test_addScheduledEvent_confirmData_name +
    ' - new event has same `when` and duration as existing, past', async () => {
    let eventToCopy = testData_scheduledEvents.find(x => x.isPast());

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testData_scheduledEvents[0].name,
      description: testData_scheduledEvents[0].description,
      when: new Date(eventToCopy.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToCopy.durationInMinutes + ((msPerMinute * testIndex) % durationModulus),
    });

    await test_addScheduledEvent_confirmData_fn(newScheduledEvent);
  });
  /*^^^^^^^^^^^^^^^^^^^^^*/

  /*** Update Scheduled Event - Confirm Index ***/
  let test_updateScheduledEvent_confirmIndex_name: string =
    'should render scheduled event with correct index when updated ';
  let test_updateScheduledEvent_confirmIndex_fn =
    async (updatedScheduledEvent: ScheduledEvent) => {
      await page.navigateTo();

      await page.updateScheduledEvent(updatedScheduledEvent);

      let updatedScheduledEventIndex: number = testData_scheduledEvents
        .findIndex(x => x.id == updatedScheduledEvent.id);
      testData_scheduledEvents[updatedScheduledEventIndex] = updatedScheduledEvent;

      // TODO: I'd like to be able to test the newly added item without having
      // to force a reload, but it's very inconsistent. This, at least, confirms
      // the item was added and is being rendered correctly, even if it isn't
      // proving that the new item shows immediately.
      await page.navigateTo();
      await page.openScheduledEventTab();
      //

      let expectedList = testData_scheduledEvents.sort(ScheduledEvent.compare);
      let expectedIndex = expectedList 
        .findIndex(x => x.id == updatedScheduledEvent.id);
      let displayedAtIndex = page.scheduledEventList.get(expectedIndex); 

      await expect(await displayedAtIndex.getAttribute("id"))
        .toEqual(`scheduledEvent_${updatedScheduledEvent.id.toString()}`);
  }
  it(test_updateScheduledEvent_confirmIndex_name +
    '- event is unique, future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let indexToUpdate = testData_scheduledEvents.indexOf(eventToUpdate);

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(futureWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmIndex_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmIndex_name +
    '- event is unique, past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let indexToUpdate = testData_scheduledEvents.indexOf(eventToUpdate);

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(pastWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmIndex_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmIndex_name +
    '- event now has same `when` as existing, future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmIndex_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmIndex_name +
    '- event now has same `when` as existing, past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmIndex_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmIndex_name +
    '- event now has same `when` and duration as existing, future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToDuplicate.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmIndex_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmIndex_name +
    '- event now has same `when` and duration as existing, past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToDuplicate.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmIndex_fn(updatedScheduledEvent);
  });
  /*^^^^^^^^^^^^^^^^^^^^^*/

  /*** Update Scheduled Event - Confirm Data ***/
  let test_updateScheduledEvent_confirmData_name: string =
    'should render updated scheduled event with correct data';
  let test_updateScheduledEvent_confirmData_fn =
    async (updatedScheduledEvent: ScheduledEvent) => {
      await page.navigateTo();

      await page.updateScheduledEvent(updatedScheduledEvent);

      let updatedScheduledEventIndex: number = testData_scheduledEvents
        .findIndex(x => x.id == updatedScheduledEvent.id);
      testData_scheduledEvents[updatedScheduledEventIndex] = updatedScheduledEvent;

      // TODO: I'd like to be able to test the newly added item without having
      // to force a reload, but it's very inconsistent. This, at least, confirms
      // the item was added and is being rendered correctly, even if it isn't
      // proving that the new item shows immediately.
      await page.navigateTo();
      await page.openScheduledEventTab();
      //

      let updatedScheduledEventItem: ElementFinder =
        page.scheduledEventListItem(updatedScheduledEvent.id);

      await expect(await page.scheduledEventListItemName(updatedScheduledEventItem)
                   .getText())
        .toEqual(updatedScheduledEvent.name);
      await expect(await page.scheduledEventListItemWhen(updatedScheduledEventItem)
                   .getText())
        .toEqual(page.formatDisplayDate(updatedScheduledEvent.when));
      await expect(await page.scheduledEventListItemDuration(updatedScheduledEventItem)
                   .getText())
        .toEqual(updatedScheduledEvent.durationInMinutes.toString());
  }
  it(test_updateScheduledEvent_confirmData_name +
    ' - event is unique, future, was past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(futureWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmData_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmData_name +
    ' - event is unique, past, was future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(pastWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmData_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmData_name +
    ' - event now has same `when` as existing, future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let indexToUpdate = testData_scheduledEvents.indexOf(eventToUpdate);
    let eventToDuplicate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmData_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmData_name +
    ' - event now has same `when` as existing, past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let indexToUpdate = testData_scheduledEvents.indexOf(eventToUpdate);
    let eventToDuplicate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmData_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmData_name +
    ' - event now has same `when` and duration as existing, future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let indexToUpdate = testData_scheduledEvents.indexOf(eventToUpdate);
    let eventToDuplicate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToDuplicate.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmData_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmData_name +
    ' - event now has same `when` and duration as existing, past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let indexToUpdate = testData_scheduledEvents.indexOf(eventToUpdate);
    let eventToDuplicate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToDuplicate.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmData_fn(updatedScheduledEvent);
  });

  /*^^^^^^^^^^^^^^^^^^^^^*/

  /*** Update Scheduled Event - Confirm Style ***/
  let test_updateScheduledEvent_confirmStyle_name: string =
    'should render list with correct styling when scheduled event updated';
  let test_updateScheduledEvent_confirmStyle_fn =
    async (updatedScheduledEvent: ScheduledEvent) => {
      await page.navigateTo();

      await page.updateScheduledEvent(updatedScheduledEvent);

      let updatedScheduledEventIndex: number = testData_scheduledEvents
        .findIndex(x => x.id == updatedScheduledEvent.id);
      testData_scheduledEvents[updatedScheduledEventIndex] = updatedScheduledEvent;

      // TODO: I'd like to be able to test the newly added item without having
      // to force a reload, but it's very inconsistent. This, at least, confirms
      // the item was added and is being rendered correctly, even if it isn't
      // proving that the new item shows immediately.
      await page.navigateTo();
      await page.openScheduledEventTab();
      //

      await expect(await page.scheduledEventListItem(updatedScheduledEvent.id)
        .getAttribute("class"))
        .toEqual(page.expectedScheduledEventStyle(updatedScheduledEvent));
  }
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event is unique, future, was past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(futureWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event is unique, future, was future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(futureWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event is unique, past, was future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(pastWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event is unique, past, was past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(pastWhen.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event now has same `when` as existing, future, was past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event now has same `when` as existing, future, was future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event now has same `when` as existing, past, was future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event now has same `when` as existing, past, was past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: testScheduledEvent.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event now has same `when` and duration as existing, future, was past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToDuplicate.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event now has same `when` and duration as existing, future, was future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => !x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToDuplicate.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event now has same `when` and duration as existing, past, was future', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => !x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToDuplicate.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  it(test_updateScheduledEvent_confirmStyle_name +
    ' - event now has same `when` and duration as existing, past, was past', async () => {
    let eventToUpdate = testData_scheduledEvents.find(x => x.isPast());
    let eventToDuplicate = testData_scheduledEvents.find(x => x.isPast());

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: new Date(eventToDuplicate.when.valueOf() + ((msPerMinute * testIndex) % minuteModulus)),
      durationInMinutes: eventToDuplicate.durationInMinutes +
        ((msPerMinute * testIndex) % durationModulus),
    });

    await test_updateScheduledEvent_confirmStyle_fn(updatedScheduledEvent);
  });
  /*^^^^^^^^^^^^^^^^^^^^^*/

  it('should show updated details for previously modified scheduled event',
     async () => {
    await page.navigateTo();

    let arbitraryIndex = 2;
    let eventToUpdate = testData_scheduledEvents[arbitraryIndex];

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: testScheduledEvent.when,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.updateScheduledEvent(updatedScheduledEvent)
    testData_scheduledEvents[arbitraryIndex] = updatedScheduledEvent;

    await page.scheduledEventDetailsButton(eventToUpdate.id).click();
    let details: ScheduledEvent = await page.readScheduledEventDetails();

    await expect(details.name).toEqual(updatedScheduledEvent.name);
    await expect(details.description).toEqual(updatedScheduledEvent.description);
    await expect(details.when).toEqual(updatedScheduledEvent.when);
    await expect(details.durationInMinutes).toEqual(updatedScheduledEvent.durationInMinutes);
  });

  it('should render list with no changes when edit scheduled event canceled',
     async () => {
    await page.navigateTo();

    let arbitraryIndex = 2;
    let eventToUpdate = testData_scheduledEvents[arbitraryIndex];

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: testScheduledEvent.when,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.cancelScheduledEventUpdate(updatedScheduledEvent);

    let display: ScheduledEvent =
      await page.readScheduledEventDisplayInList(eventToUpdate.id);

    await expect(display.name).toEqual(updatedScheduledEvent.name);
    await expect(display.description).toBeUndefined();
    await expect(display.when).toEqual(updatedScheduledEvent.when);
    await expect(display.durationInMinutes).toEqual(updatedScheduledEvent.durationInMinutes);
  });
  it('should render persisted details when previously canceled details edit re-opened',
     async () => {
    await page.navigateTo();

    let arbitraryIndex = 2;
    let eventToUpdate = testData_scheduledEvents[arbitraryIndex];

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: testScheduledEvent.when,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.cancelScheduledEventUpdate(updatedScheduledEvent);

    await page.scheduledEventDetailsButton(eventToUpdate.id).click();
    let details: ScheduledEvent = await page.readScheduledEventDetails();

    await expect(details.name).toEqual(eventToUpdate.name);
    await expect(details.description).toEqual(eventToUpdate.description);
    await expect(details.when).toEqual(eventToUpdate.when);
    await expect(details.durationInMinutes).toEqual(eventToUpdate.durationInMinutes);
  });
  it('should populate details with defaults when adding new event ' +
    '- after editing another previously', async () => {
    await page.navigateTo();

    let arbitraryIndex = 2;
    let eventToUpdate = testData_scheduledEvents[arbitraryIndex];

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: testScheduledEvent.when,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.updateScheduledEvent(updatedScheduledEvent)
    testData_scheduledEvents[arbitraryIndex] = updatedScheduledEvent;

    await page.addScheduledEventButton.click();
    let details: ScheduledEvent = await page.readScheduledEventDetails();
    let expectedNow: Date = new Date(Date.now());
    expectedNow.setSeconds(0);
    expectedNow.setMilliseconds(0);

    await expect(details.name).toEqual(page.addScheduledEventDefault.name);
    await expect(details.description)
      .toEqual(page.addScheduledEventDefault.description);
    await expect(details.when.valueOf())
      .toBeGreaterThanOrEqual(expectedNow.valueOf() - msPerMinute);
    await expect(details.when.valueOf())
      .not.toBeGreaterThan(expectedNow.valueOf() + msPerMinute);
    await expect(details.durationInMinutes)
      .toEqual(page.addScheduledEventDefault.durationInMinutes);
  });
  it('should populate details with defaults when adding new event ' +
    '- after cancelling an add previously', async () => {
    await page.navigateTo();
    await page.openScheduledEventTab();

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: testScheduledEvent.when,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.addScheduledEventButton.click();
    await page.insertScheduledEventDetails(newScheduledEvent);
    await page.cancelScheduledEventEdit();

    await page.addScheduledEventButton.click();
    let details: ScheduledEvent = await page.readScheduledEventDetails();
    let expectedNow: Date = new Date(Date.now());
    expectedNow.setSeconds(0);
    expectedNow.setMilliseconds(0);

    await expect(details.name).toEqual(page.addScheduledEventDefault.name);
    await expect(details.description)
      .toEqual(page.addScheduledEventDefault.description);
    await expect(details.when.valueOf())
      .toBeGreaterThanOrEqual(expectedNow.valueOf() - msPerMinute);
    await expect(details.when.valueOf())
      .not.toBeGreaterThan(expectedNow.valueOf() + msPerMinute);
    await expect(details.durationInMinutes)
      .toEqual(page.addScheduledEventDefault.durationInMinutes);
  });
  it('should populate details with defaults when adding new event ' +
    '- after cancelling editing another previously', async () => {
    await page.navigateTo();

    let arbitraryIndex = 2;
    let eventToUpdate = testData_scheduledEvents[arbitraryIndex];

    let updatedScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: eventToUpdate.id,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: testScheduledEvent.when,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.cancelScheduledEventUpdate(updatedScheduledEvent);

    await page.addScheduledEventButton.click();
    let details: ScheduledEvent = await page.readScheduledEventDetails();
    let expectedNow: Date = new Date(Date.now());
    expectedNow.setSeconds(0);
    expectedNow.setMilliseconds(0);

    await expect(details.name).toEqual(page.addScheduledEventDefault.name);
    await expect(details.description)
      .toEqual(page.addScheduledEventDefault.description);
    await expect(details.when.valueOf())
      .toBeGreaterThanOrEqual(expectedNow.valueOf() - msPerMinute);
    await expect(details.when.valueOf())
      .not.toBeGreaterThan(expectedNow.valueOf() + msPerMinute);
    await expect(details.durationInMinutes)
      .toEqual(page.addScheduledEventDefault.durationInMinutes);
  });
  it('should populate persisted details when editing existing event, after ' +
    '- having added a separate event', async () => {
    await page.navigateTo();

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: testScheduledEvent.when,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.addScheduledEvent(newScheduledEvent)
    testData_scheduledEvents = [...testData_scheduledEvents, newScheduledEvent];

    let eventToTest: ScheduledEvent = testData_scheduledEvents
      .find(x => x.id != newScheduledEvent.id);

    await page.scheduledEventDetailsButton(eventToTest.id).click();
    let details: ScheduledEvent = await page.readScheduledEventDetails();

    await expect(details.name).toEqual(eventToTest.name);
    await expect(details.description).toEqual(eventToTest.description);
    await expect(details.when).toEqual(eventToTest.when);
    await expect(details.durationInMinutes).toEqual(eventToTest.durationInMinutes);
  });
  it('should populate persisted details when editing existing event, after ' +
    '- having added the same event', async () => {
    await page.navigateTo();

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: testScheduledEvent.when,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.addScheduledEvent(newScheduledEvent)
    testData_scheduledEvents = [...testData_scheduledEvents, newScheduledEvent];

    await page.scheduledEventDetailsButton(newScheduledEvent.id).click();
    let details: ScheduledEvent = await page.readScheduledEventDetails();

    await expect(details.name).toEqual(newScheduledEvent.name);
    await expect(details.description).toEqual(newScheduledEvent.description);
    await expect(details.when).toEqual(newScheduledEvent.when);
    await expect(details.durationInMinutes)
      .toEqual(newScheduledEvent.durationInMinutes);
  });
  it('should successfully add new scheduled event ' +
    '- with date 1900-01-01T12:00:00 (lower-limit)', async () => {
    await page.navigateTo();

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: lowerLimitWhen,
      durationInMinutes: testScheduledEvent.durationInMinutes,
    });

    await page.addScheduledEvent(newScheduledEvent);
    testData_scheduledEvents = [...testData_scheduledEvents, newScheduledEvent];

    let expectedQuantity: number = testData_scheduledEvents.length;
    await expect(await page.scheduledEventList.count())
      .toEqual(expectedQuantity);
  });
  it('should successfully add new scheduled event ' +
    '- with date 2079-06-05T12:00:00 (upper-limit)', async () => {
    await page.navigateTo();

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: upperLimitWhen,
      durationInMinutes: 60,
    });

    await page.addScheduledEvent(newScheduledEvent);
    testData_scheduledEvents = [...testData_scheduledEvents, newScheduledEvent];

    let expectedQuantity: number = testData_scheduledEvents.length;
    await expect(await page.scheduledEventList.count())
      .toEqual(expectedQuantity);
  });
  it('should do nothing (not close sideNav or save) when add new scheduled event ' +
    '- with date 1899-12-31T12:00:00 (below lower-limit)', async () => {
    await page.navigateTo();

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: belowLowerLimitWhen,
      durationInMinutes: 60,
    });

    await page.addScheduledEvent(newScheduledEvent, false);
    await page.cancelScheduledEventEdit();

    let expectedQuantity: number = testData_scheduledEvents.length;
    await expect(await page.scheduledEventList.count())
      .toEqual(expectedQuantity);
  });
  it('should do nothing (not close sideNav or save) when add new scheduled event ' +
    '- with date 2079-06-07T12:00:00 (above upper-limit)', async () => {
    await page.navigateTo();

    let newScheduledEvent: ScheduledEvent = new ScheduledEvent({
      id: testData_scheduledEvents.length + 1,
      name: testScheduledEvent.name,
      description: testScheduledEvent.description,
      when: aboveUpperLimitWhen,
      durationInMinutes: 60,
    });

    await page.addScheduledEvent(newScheduledEvent, false);
    await page.cancelScheduledEventEdit();

    let expectedQuantity: number = testData_scheduledEvents.length;
    await expect(await page.scheduledEventList.count())
      .toEqual(expectedQuantity);
  });
  it('should render message "monthly-calendar works!" when monthly button toggle clicked',
     async () => {
       await page.navigateTo();
       await page.openScheduledEventTab();
       await page.monthlyButtonToggle.click();

       await expect(await page.monthlyScheduledEventsComponent.getText())
        .toEqual("monthly-calendar works!");
  });
  it('should render List scheduled events display when List toggle button selected',
     async () => {
       await page.navigateTo();
       await page.openScheduledEventTab();
       await page.monthlyButtonToggle.click();
       await page.listButtonToggle.click();

       await expect(page.listScheduledEventsComponent.isPresent())
        .toBeTruthy();
  });
  it('should render Monthly scheduled events display when Monthly toggle button selected',
     async () => {
       await page.navigateTo();
       await page.openScheduledEventTab();
       await page.monthlyButtonToggle.click();

       await expect(page.monthlyScheduledEventsComponent.isPresent())
        .toBeTruthy();
  });
});

