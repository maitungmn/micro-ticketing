import {Message} from "node-nats-streaming"
import {Listener, OrderCreatedEvent, Subjects} from "@mttickets/common";

import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the ticket that the order os reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found!')
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({orderId: data.id})

    // Save the ticket
    await ticket.save()
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      ...ticket,
    })

    // ack the message
    msg.ack()
  }

}