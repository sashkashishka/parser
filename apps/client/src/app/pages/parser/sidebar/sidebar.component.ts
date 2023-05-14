import { Component, Input } from '@angular/core';
import { iParseUnit } from '../types';
import { ParserService } from '../parser.service';
import { PARSE_STATUS } from '../constants';

// TODO: refactor (
// * logic of isCreateParseUnit
// * logic of delete
// * logic of closing form
// refactor to store (maybe ngrx)
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  public emptyParseUnit: iParseUnit = {
    id: 0,
    name: '',
    frequency: 10000,
    siteUrl: '',
    selected: false,
  };

  @Input()
  public status: PARSE_STATUS | null;

  @Input()
  public parseUnits: iParseUnit[] | null

  constructor(
    public parserService: ParserService,
  ) {}

  public startParse() {
    this.parserService.emitStart();
  }

  public stopParse() {
    this.parserService.emitStop();
  }
}
