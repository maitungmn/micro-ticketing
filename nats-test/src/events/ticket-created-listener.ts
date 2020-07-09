import {Message} from "node-nats-streaming";
import {Listener} from "./base-listener";
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName = 'payment-service';
  readonly subject = Subjects.TicketCreated;

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data)

    console.log(data.id)
    console.log(data.title)

    msg.ack()
  }

}