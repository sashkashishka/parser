import { FormControl } from "@angular/forms";

export interface iFormValues {
  name: string;
  password: string;
}

export type tNgFormValues = {
  [K in keyof iFormValues]: FormControl<iFormValues[K]>;
}
