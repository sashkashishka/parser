import { Component, OnInit } from '@angular/core';
import { ParserService } from '../parser.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Observer } from 'rxjs';
import { iAd } from '../types';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  private RESULTS_KEY = 'RESULTS_KEY';

  private SAVE_QTY = 50;

  constructor(
    private parserService: ParserService,
    private ls: LocalStorageService,
  ) {}

  public results: iAd[] = [];

  public notViewedList = new Map<number, boolean>();

  ngOnInit(): void {
    this.hydrate();
    this.parserService.ads$.subscribe(this.observer);
  }

  private hydrate() {
    this.results = this.ls.getData(this.RESULTS_KEY) ?? [];
  }

  private get observer(): Observer<iAd> {
    return {
      next: (data) => {
        this.results.push(data);
        this.notViewedList.set(data.id, false);

        this.saveLastNAds();
      },
      error: () => {},
      complete: () => {},
    };
  }

  private saveLastNAds() {
    if (!Array.isArray(this.results)) return;

    this.ls.saveData(this.RESULTS_KEY, this.results.slice(-this.SAVE_QTY));
  }

  public markViewed(id: number) {
    this.notViewedList.delete(id);
  }
}
