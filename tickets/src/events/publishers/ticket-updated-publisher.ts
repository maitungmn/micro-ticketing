import {Publisher, Subjects, TicketUpdatedEvent} from "@mttickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated;

}