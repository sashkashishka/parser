import { Component, OnInit } from '@angular/core';
import { ParserService } from '../parser.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  constructor(private parserService: ParserService) {}

  public results: any[] = [];

  ngOnInit(): void {
    this.parserService.ads$.subscribe((data) => {
      this.results.push(data);
    });
  }
}
