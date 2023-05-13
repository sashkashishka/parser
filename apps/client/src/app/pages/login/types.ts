import { FormControl } from "@angular/forms";

export interface iAuthFormValues {
  username: string;
  password: string;
}

export type tNgAuthFormValues = {
  [K in keyof iAuthFormValues]: FormControl<iAuthFormValues[K]>;
}
