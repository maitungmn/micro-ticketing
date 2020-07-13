import {Message} from "node-nats-streaming"
import {Listener, Subjects, TicketUpdatedEvent} from "@mttickets/common";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const dataModified: TicketUpdatedEvent['data'] = {
      id: data.id,
      // @ts-ignore
      ...data._doc || data,
    }
    // @ts-ignore
    delete dataModified._id

    const ticket = await Ticket.findByEvent(dataModified)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const {title, price} = dataModified
    ticket.set({title, price})
    await ticket.save()

    msg.ack()
  }
}