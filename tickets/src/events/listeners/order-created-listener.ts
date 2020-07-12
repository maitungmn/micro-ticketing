import {Message} from "node-nats-streaming"
import {Listener, OrderCreatedEvent, Subjects} from "@mttickets/common";
import {queueGroupName} from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

  }

}