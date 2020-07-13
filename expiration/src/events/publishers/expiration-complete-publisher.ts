import {ExpirationCompleteEvent, Publisher, Subjects} from "@mttickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  readonly subject = Subjects.ExpirationComplete;

}