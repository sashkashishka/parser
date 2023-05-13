import { Component, OnInit, AfterViewInit } from '@angular/core';
import { iParseUnit, iParseUnitSelectable } from '../types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParserService } from '../parser.service';

// TODO: refactor (
// * logic of isCreateParseUnit
// * logic of delete
// * logic of closing form
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements AfterViewInit {
  public emptyParseUnit: iParseUnit = {
    id: 0,
    name: '',
    frequency: 10000,
    siteUrl: '',
  };

  constructor(
    private snackbar: MatSnackBar,
    private parserService: ParserService,
  ) {}

  ngAfterViewInit(): void {
    this.parserService.emitConfig({});
    this.parserService.parseUnits$.next();
  }

  public get selectableParseUnits() {
    return this.parserService.selectableParseUnits$;
  }

  public deleteParseUnit(id: number) {
    return this.parserService.deleteParseUnit(id).subscribe({
      next: () => {
        this.parserService.parseUnits$.next();
      },
      error: (error) => {
        this.snackbar.open(error.message, 'Got it', {
          duration: 4000,
        });
      },
    });
  }

  public onToggle(parseUnit: iParseUnit) {
    // this.parserService.toggleActiveParseUnit(parseUnit);
  }

  public onFormClose() {
    this.parserService.parseUnits$.next();
    this.setIsCreateParseUnit(false);
  }

  public isCreateParseUnit = false;

  public setIsCreateParseUnit(v: boolean) {
    this.isCreateParseUnit = v;
  }
}
