export interface iParseUnit {
  id: number;
  frequency: number; // polling delay time in ms
  siteUrl: string;
  name: string;
}

export interface iInitEvent {
  endTime: Date;
  parseUnits: iParseUnit[];
} 

export interface iErrorEvent {
  code: string; 
  message: string;
}

export interface iAdsEvent extends iParseUnit {} 