import { iAd } from "src/types/ad";

export enum PollingEvents {
  AD = 'ad',
  ERROR = 'error',
}

export abstract class iPollingEvent {
  type: PollingEvents;
  payload?: unknown;
}

export class AdPollingEvent extends iPollingEvent {
  constructor(public payload: iAd[], public type = PollingEvents.AD) {
    super();
  }
}

export class ErrorPollingEvent extends iPollingEvent {
  constructor(public payload: Error, public type = PollingEvents.ERROR) {
    super();
  }
}
