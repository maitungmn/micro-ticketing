import {Listener, OrderCreatedEvent, Subjects} from "@mttickets/common";
import {Message} from "node-nats-streaming"

import {queueGroupName} from "./queue-group-name";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add({
      orderId: data.id
    })

    msg.ack()
  }
}