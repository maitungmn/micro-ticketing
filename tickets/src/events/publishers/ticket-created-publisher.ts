import {Publisher, Subjects, TicketCreatedEvent} from "@mttickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;

}