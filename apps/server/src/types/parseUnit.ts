export interface iParseUnit {
  id: number;
  frequency: number; // polling delay time in ms
  endTime: Date | null;
  olxSiteUrl: string;
  name: string;
}
