import { Deserializable } from './deserializable';
import { Identifiable } from './identifiable';

export class Reminder implements Deserializable, Identifiable {
  id: number;
  value: string;
  isCompleted: boolean;

  constructor (init?:Partial<Reminder>) {
    if (init !== undefined) {
      Object.assign(this, init);
    }
  }

  deserialize(input: any) {
    if (input.id !== undefined) this.id = input.id;
    if (input.value !== undefined) this.value = input.value;
    if (input.isCompleted !== undefined) this.isCompleted = input.isCompleted;
    return this;
  }

  static compare(a: Reminder, b: Reminder): number {
    if (a.isCompleted == b.isCompleted)
    {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      if (a.id == b.id) return 0;
    }
    else if (a.isCompleted == true) return 1;
    else return -1;
  }

  compareTo(other: Reminder): number {
    return Reminder.compare(this, other);
  }
}
