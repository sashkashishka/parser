import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParserService } from './parser.service';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss'],
  providers: [SocketService, ParserService],
})
export class ParserComponent implements OnInit, OnDestroy {
  constructor(private parserService: ParserService) {}

  ngOnInit() {
    this.parserService.connect();
  }

  ngOnDestroy(): void {
    this.parserService.disconnect();
  }

  get init() {
    return this.parserService.init;
  }

  onClick() {
    console.log('click');
    this.parserService.emitInit();
  }
}
