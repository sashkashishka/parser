import { Component, Input, OnInit } from '@angular/core';
import { iParseUnit } from '../../types';
import { PARSE_UNIT_STATE } from './types';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { ParseUnitFormComponent } from './form.component';
import { iBottomSheetConfig } from './types';
import { ParserService } from '../../parser.service';

@Component({
  selector: 'app-parse-unit',
  templateUrl: './parse-unit.component.html',
  styleUrls: ['./parse-unit.component.scss'],
})
export class ParseUnitComponent implements OnInit {
  @Input()
  public parseUnit: iParseUnit;

  public state: PARSE_UNIT_STATE;

  private bottomSheetRef?: MatBottomSheetRef<ParseUnitFormComponent>;

  constructor(
    private bottomSheet: MatBottomSheet,
    private parserService: ParserService,
  ) {}

  ngOnInit(): void {
    switch (true) {
      case this.parseUnit.id === 0: {
        this.setState(PARSE_UNIT_STATE.CREATE);

        break;
      }

      default:
        this.setState(PARSE_UNIT_STATE.VIEW);
    }
  }

  public toggle() {
    return this.parserService.updateParseUnit({
      ...this.parseUnit,
      selected: !this.parseUnit.selected,
    });
  }

  public delete() {
    return this.parserService.deleteParseUnit(this.parseUnit.id);
  }

  public edit() {
    this.setState(PARSE_UNIT_STATE.EDIT);
    this.openForm();
  }

  private setState(state: PARSE_UNIT_STATE) {
    this.state = state;
  }

  public openForm() {
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
  }
}
