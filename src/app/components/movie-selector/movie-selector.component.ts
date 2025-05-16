import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { FormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Movie } from '../../models/movie';
import { NgFor } from '@angular/common';
import { MovieDetails } from '../../models/movie-details';

@Component({
  selector: 'app-movie-selector',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatSelectModule, NgFor],
  templateUrl: './movie-selector.component.html',
  styleUrl: './movie-selector.component.scss',
})
export class MovieSelectorComponent {
  @Input() movies: Movie[] = [];
  @Output() movieSelected = new EventEmitter<Movie>();

  onSelectMovie(movie: Movie): void {
    this.movieSelected.emit(movie);
  }
}
