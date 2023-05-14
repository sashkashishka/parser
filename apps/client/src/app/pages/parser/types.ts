import { PARSE_STATUS } from './constants';

export interface iAd {
  id: number;
}

export interface iParseUnit {
  id: number;
  frequency: number; // polling delay time in ms
  siteUrl: string;
  name: string;
  selected: boolean;
}

export interface iConfigEvent {
  endTime: Date;
  parseUnits: iParseUnit[];
}

export interface iErrorEvent {
  code: string;
  message: string;
}

export type tStatusEvent = PARSE_STATUS;

export interface iAdsEvent extends iParseUnit {}

export interface iCompleteEvent {}
