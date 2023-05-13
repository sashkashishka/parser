import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { iParseUnit } from '../../types';
import { PARSE_UNIT_STATE } from './types';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { ParseUnitFormComponent } from './form.component';
import { iBottomSheetConfig } from './types';

@Component({
  selector: 'app-parse-unit',
  templateUrl: './parse-unit.component.html',
  styleUrls: ['./parse-unit.component.scss'],
})
export class ParseUnitComponent implements OnInit {
  @Input()
  public parseUnit: iParseUnit;

  @Output()
  public onToggle = new EventEmitter();

  @Output()
  public onFormClose = new EventEmitter();

  @Output()
  public deleteParseUnit = new EventEmitter<number>();

  public state: PARSE_UNIT_STATE;

  private bottomSheetRef?: MatBottomSheetRef<ParseUnitFormComponent>;

  constructor(private bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {
    switch (true) {
      case this.parseUnit.id === 0: {
        this.state = PARSE_UNIT_STATE.CREATE;
        this.openForm();

        break;
      }

      default:
        this.state = PARSE_UNIT_STATE.VIEW;
    }
  }

  public toggle() {}

  public edit() {
    this.setState(PARSE_UNIT_STATE.EDIT);
    this.openForm();
  }

  public delete() {
    this.deleteParseUnit.emit(this.parseUnit.id);
  }

  private setState(state: PARSE_UNIT_STATE) {
    this.state = state;
  }

  private openForm() {
    if (this.bottomSheetRef) return;

    this.bottomSheetRef = this.bottomSheet.open<
      ParseUnitFormComponent,
      iBottomSheetConfig
    >(ParseUnitFormComponent, {
      closeOnNavigation: true,
      data: {
        parseUnit: this.parseUnit,
        state: this.state,
      },
    });

    this.bottomSheetRef.afterDismissed().subscribe(() => {

      this.onFormClose.emit();

      this.bottomSheetRef = undefined;
    });
  }
}
