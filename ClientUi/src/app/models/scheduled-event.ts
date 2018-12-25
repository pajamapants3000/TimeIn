import { Deserializable } from './deserializable';
import { Identifiable } from './identifiable';

export class ScheduledEvent implements Deserializable, Identifiable {
  id: number;
  name: string;
  description: string;
  when: Date;
  durationInMinutes: number;

  constructor (init?:Partial<ScheduledEvent>) {
    if (init !== undefined) {
      Object.assign(this, init);
    }
  }

  deserialize(input: any) {
    if (input.id !== undefined) this.id = input.id;
    if (input.name !== undefined) this.name = input.name;
    if (input.description !== undefined) this.description = input.description;
    if (input.when !== undefined) this.when = new Date(input.when);
    if (input.durationInMinutes !== undefined) this.durationInMinutes = input.durationInMinutes;
    return this;
  }

  isPast(when: Date): boolean {
    if (when == null) return undefined;
    return (new Date(when.valueOf())).getTime() < Date.now();
  }

  static compare(a: ScheduledEvent, b: ScheduledEvent): number {
    let aDate = new Date(a.when.valueOf());
    let bDate = new Date(b.when.valueOf());

    if (aDate.getTime() == bDate.getTime()) return 0;

    if (aDate.getTime() >= Date.now() &&
       bDate.getTime() >= Date.now())
    {
      if (aDate.getTime() < bDate.getTime()) return -1;
      if (aDate.getTime() > bDate.getTime()) return 1;
    }

    if (aDate.getTime() < bDate.getTime()) return 1;
    if (aDate.getTime() > bDate.getTime()) return -1;
  }

  compareTo(other: ScheduledEvent): number {
    return ScheduledEvent.compare(this, other);
  }
}

