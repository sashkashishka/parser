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
  constructor(private parseUnitService: ParserService) {}

  ngOnInit() {
    this.parseUnitService.connect();
  }

  ngOnDestroy(): void {
    this.parseUnitService.disconnect();
  }

  get init() {
    return this.parseUnitService.init;
  }

  onClick() {
    console.log('click');
    this.parseUnitService.emitInit();
  }
}
