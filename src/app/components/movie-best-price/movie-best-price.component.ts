import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { FareComparison } from '../../models/fare-comparison';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-movie-best-price',
  standalone: true,
  imports: [MatCard, MatCardContent, MatCardTitle, CurrencyPipe],
  templateUrl: './movie-best-price.component.html',
  styleUrls: ['./movie-best-price.component.scss'],
})
export class MovieBestPriceComponent {
  @Input() fareComparison!: FareComparison;
}
