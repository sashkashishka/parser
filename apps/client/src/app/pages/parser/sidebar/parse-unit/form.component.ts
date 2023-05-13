import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarService } from '../sidebar.service';
import {
  PARSE_UNIT_STATE,
  iBottomSheetConfig,
  tNgParseUnitFormValues,
} from './types';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-parse-unit-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [SidebarService],
})
export class ParseUnitFormComponent implements OnInit {
  public parseUnitForm = new FormGroup<tNgParseUnitFormValues>({
    frequency: new FormControl<number>(10000, {
      nonNullable: true,
      initialValueIsDefault: true,
      validators: [Validators.required, Validators.min(5000)],
    }),
    name: new FormControl<string>('', {
      nonNullable: true,
      initialValueIsDefault: true,
      validators: [Validators.required],
    }),
    siteUrl: new FormControl<string>('', {
      nonNullable: true,
      initialValueIsDefault: true,
      validators: [
        Validators.required,
        Validators.pattern(
          /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/,
        ),
      ],
    }),
  });

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: iBottomSheetConfig,
    private bottomSheetRef: MatBottomSheetRef<ParseUnitFormComponent>,
    private sidebarService: SidebarService,
    private snackback: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const { parseUnit } = this.data;

    this.parseUnitForm.setValue({
      name: parseUnit.name,
      siteUrl: parseUnit.siteUrl,
      frequency: parseUnit.frequency,
    });
  }

  public get name() {
    return this.parseUnitForm.get('name');
  }

  public get siteUrl() {
    return this.parseUnitForm.get('siteUrl');
  }

  public get frequency() {
    return this.parseUnitForm.get('frequency');
  }

  public submitting = false;

  public onSubmit() {
    if (this.submitting) return;

    this.submitting = true;

    let method: 'addParseUnit' | 'updateParseUnit' = 'addParseUnit';
    let successMsg = 'Parse unit created';

    console.log(this.data)

    if (this.data.state === PARSE_UNIT_STATE.EDIT) {
      method = 'updateParseUnit';
      successMsg = 'Parse unit updated';
    }

    return this.sidebarService[method]({
      ...this.parseUnitForm.value,
      id: this.data.parseUnit.id,
    }).subscribe({
      next: (data) => {
        this.submitting = false;
        this.snackback.open(successMsg, 'Got it', { duration: 4000 });

        this.bottomSheetRef.dismiss(data);
      },
      error: (error) => {
        let message = error.message;

        if (error instanceof HttpErrorResponse) {
          message = error?.error?.message || error?.message;
        }

        this.submitting = false;
        this.snackback.open(message, 'Got it', { duration: 4000 });
      },
    });
  }
}
