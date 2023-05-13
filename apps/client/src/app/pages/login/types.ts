import { FormControl } from "@angular/forms";

export interface iFormValues {
  username: string;
  password: string;
}

export type tNgFormValues = {
  [K in keyof iFormValues]: FormControl<iFormValues[K]>;
}
