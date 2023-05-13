import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { iParseUnit } from '../types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [SidebarService],
})
export class SidebarComponent implements OnInit {
  public parseUnits: iParseUnit[] = [];

  public emptyParseUnit: iParseUnit = {
    id: 0,
    name: '',
    frequency: 10000,
    siteUrl: '',
  };

  constructor(
    private sidebarService: SidebarService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.fetchParseUnits();
  }

  public deleteParseUnit(id: number) {
    return this.sidebarService.deleteParseUnit(id).subscribe({
      next: () => {
        this.fetchParseUnits();
      },
      error: (error) => {
        this.snackbar.open(error.message, 'Got it', {
          duration: 4000,
        });
      },
    });
  }

  public onBottomSheetClose() {
    this.fetchParseUnits();
    this.setIsCreateParseUnit(false);
  }

  public isCreateParseUnit = false;

  public setIsCreateParseUnit(v: boolean) {
    this.isCreateParseUnit = v;
  }

  private fetchParseUnits() {
    return this.sidebarService.getParseUnits().subscribe({
      next: (parseUnits) => {
        this.parseUnits = parseUnits;
      },
      error: (error) => {
        this.snackbar.open(error.message, 'Got it', {
          duration: 4000,
        });
      },
    });
  }

}
