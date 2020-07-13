import {Listener, OrderCancelledEvent, Subjects} from "@mttickets/common";
import {Message} from "node-nats-streaming"
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  queueGroupName: string = queueGroupName;
  readonly subject = Subjects.OrderCancelled;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({orderId: undefined})
    await ticket.save()
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      ...ticket
    })

    msg.ack()
  }
}