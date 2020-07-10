import {OrderCancelledEvent, Publisher, Subjects} from "@mttickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

}