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

  constructor(
    private sidebarService: SidebarService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.fetchParseUnits();
  }

  public fetchParseUnits() {
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
}
