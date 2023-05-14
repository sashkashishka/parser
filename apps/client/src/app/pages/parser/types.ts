import { PARSE_STATUS } from "./constants";

export interface iParseUnit {
  id: number;
  frequency: number; // polling delay time in ms
  siteUrl: string;
  name: string;
  selected: boolean;
}

export interface iCommonEvent {
  status: PARSE_STATUS;
}

export interface iConfigEvent extends iCommonEvent {
  endTime: Date;
  parseUnits: iParseUnit[];
} 

export interface iErrorEvent extends iCommonEvent {
  code: string; 
  message: string;
}

export type tStatusEvent = PARSE_STATUS;

export interface iAdsEvent extends iParseUnit, iCommonEvent {} 

export interface iCompleteEvent extends iCommonEvent {}
