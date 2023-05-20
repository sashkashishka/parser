import { PARSE_STATUS } from './constants';

export interface iAd {
  id: number;
  url: string;
  last_refresh_time: string;
  title: string;
  params: Array<{
    key: string;
    name: string;
    value: {
      key: string;
      label: string;
    };
  }>;
  location: {
    city: {
      name: string;
    };
  };
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
