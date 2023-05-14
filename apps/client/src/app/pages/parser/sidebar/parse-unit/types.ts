import { FormControl } from "@angular/forms";
import { iParseUnit } from "../../types";

export interface iParseUnitFormValues {
  frequency: number; // in ms
  name: string;
  siteUrl: string;
  selected: boolean;
}

export type tNgParseUnitFormValues = {
  [K in keyof iParseUnitFormValues]: FormControl<iParseUnitFormValues[K]>;
}

export enum PARSE_UNIT_STATE {
  CREATE = 'create',
  VIEW = 'view',
  EDIT = 'edit',
}

export interface iBottomSheetConfig {
  parseUnit: iParseUnit;
  state: PARSE_UNIT_STATE;
}
