import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParseUnitService } from './parse-unit.service';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-parse-unit',
  templateUrl: './parse-unit.component.html',
  styleUrls: ['./parse-unit.component.scss'],
  providers: [SocketService, ParseUnitService],
})
export class ParseUnitComponent implements OnInit, OnDestroy {
  constructor(private parseUnitService: ParseUnitService) {}

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
