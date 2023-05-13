import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParserService } from './parser.service';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss'],
})
export class ParserComponent implements OnInit, OnDestroy {
  constructor(private parserService: ParserService) {}

  ngOnInit() {
    this.parserService.connect();
  }

  ngOnDestroy(): void {
    this.parserService.disconnect();
  }
}
