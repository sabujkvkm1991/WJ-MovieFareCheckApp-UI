import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';
import { Movie } from '../../models/movie';
import { FareComparison } from '../../models/fare-comparison';
import { MovieDetails } from '../../models/movie-details';
import { MatButtonModule } from '@angular/material/button';
import { MovieSelectorComponent } from '../../components/movie-selector/movie-selector.component';
import { MovieBestPriceComponent } from '../../components/movie-best-price/movie-best-price.component';
import { MovieDetailsComponent } from '../../components/movie-details/movie-details.component';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compare-price',
  templateUrl: './compare-price.component.html',
  styleUrls: ['./compare-price.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MovieSelectorComponent,
    MovieBestPriceComponent,
    MovieDetailsComponent,
    MatProgressSpinnerModule,
  ],
  providers: [MovieService],
})
export class ComparePriceComponent implements OnInit {
  movies: Movie[] = [];
  selectedMovieId: string = '';
  result?: FareComparison;
  movieDetails?: MovieDetails;
  error?: string;
  isLoading: boolean = false;
  isMovieLoading: boolean = false;

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.isMovieLoading = true;
    this.movieService
      .getMovies()
      .pipe(finalize(() => (this.isMovieLoading = false)))
      .subscribe({
        next: (res) => (this.movies = res),
        error: (err) => (this.error = 'Failed to load movies'),
      });
  }

  onCompare(): void {
    if (!this.selectedMovieId) return;

    this.result = undefined;
    this.error = undefined;
    this.isLoading = true;

    this.movieService
      .comparePrice(this.selectedMovieId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => (this.result = res),
        error: (err) => (this.error = 'Comparison failed'),
      });
  }

  fetchMovieDetails(movie: Movie): void {
    this.selectedMovieId = movie.id;

    this.movieDetails = undefined;
    this.error = undefined;
    this.result = undefined;
    this.isLoading = true;

    this.movieService
      .getMovieDetails(this.selectedMovieId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => (this.movieDetails = res),
        error: (err) => (this.error = 'Movie details fetch failed'),
      });
  }

  logout() {
    localStorage.clear(); // ✅ or just remove token: localStorage.removeItem('token');
    this.router.navigate(['/login']); // ✅ redirect to login
  }
}
