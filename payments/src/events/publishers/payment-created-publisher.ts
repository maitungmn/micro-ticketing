import {PaymentCreatedEvent, Publisher, Subjects} from "@mttickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

}