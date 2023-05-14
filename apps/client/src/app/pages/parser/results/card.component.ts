import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iAd } from '../types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input()
  public ad: iAd;

  @Input()
  public isViewed: boolean;

  @Output()
  public markViewed = new EventEmitter()

  public onClick() {
    this.markViewed.emit(this.ad.id);
  }
}
