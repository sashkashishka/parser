import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ParserService } from './parser.service';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss'],
})
export class ParserComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(public parserService: ParserService) {}

  ngOnInit() {
    this.parserService.connect();
  }

  ngAfterViewInit(): void {
    this.parserService.emitStatus();
    this.parserService.emitConfig({});
    this.parserService.refetchParseUnit();
  }

  ngOnDestroy(): void {
    this.parserService.disconnect();
  }
}
