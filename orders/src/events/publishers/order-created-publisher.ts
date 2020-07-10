import {OrderCreatedEvent, Publisher, Subjects} from "@mttickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  readonly subject = Subjects.OrderCreated;

}