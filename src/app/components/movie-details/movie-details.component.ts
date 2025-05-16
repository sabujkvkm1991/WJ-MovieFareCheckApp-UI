import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MovieDetails } from '../../models/movie-details';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardContent],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  @Input() details!: MovieDetails;
}
