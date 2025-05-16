import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ComparePriceComponent } from './compare-price.component';
import { MovieService } from '../../services/movie/movie.service';
import { of, throwError } from 'rxjs';
import { Movie } from '../../models/movie';
import { FareComparison } from '../../models/fare-comparison';
import { MovieDetails } from '../../models/movie-details';
import { MatButtonModule } from '@angular/material/button';
import { MovieSelectorComponent } from '../../components/movie-selector/movie-selector.component';
import { MovieBestPriceComponent } from '../../components/movie-best-price/movie-best-price.component';
import { MovieDetailsComponent } from '../../components/movie-details/movie-details.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ComparePriceComponent', () => {
  let component: ComparePriceComponent;
  let fixture: ComponentFixture<ComparePriceComponent>;
  let mockMovieService: jasmine.SpyObj<MovieService>;

  const mockMovies: Movie[] = [
    {
      id: '1',
      title: 'Movie A',
      type: 'Action',
      poster: 'poster1.jpg',
      year: '2023',
    },
  ];
  const mockFareComparison: FareComparison = {
    movieId: 'cw123',
    provider: 'Test',
    title: 'test',
    cheapestPrice: '10',
  };
  const mockMovieDetails: MovieDetails = {
    id: '1',
    title: 'Movie A',
    type: 'Action',
    poster: 'poster1.jpg',
    year: '2023',
    plot: 'A great movie',
    rating: '8.5',
    director: 'Director A',
    genre: 'Action',
    actors: 'Actor A, Actor B',
    language: 'English',
    country: 'USA',
    metascore: '85',
    price: 129,
    rated: 'PG-13',
    released: '2023-01-01',
    runtime: '120 min',
    votes: '1000',
    writer: 'Writer A',
  };

  beforeEach(waitForAsync(() => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', [
      'getMovies',
      'comparePrice',
      'getMovieDetails',
    ]);

    TestBed.configureTestingModule({
      imports: [
        ComparePriceComponent,
        MatButtonModule,
        MovieSelectorComponent,
        MovieBestPriceComponent,
        MovieDetailsComponent,
        MatProgressSpinnerModule,
      ],
      providers: [{ provide: MovieService, useValue: movieServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparePriceComponent);
    component = fixture.componentInstance;
    mockMovieService = TestBed.inject(
      MovieService
    ) as jasmine.SpyObj<MovieService>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    mockMovieService.getMovies.and.returnValue(of(mockMovies));
    component.ngOnInit();
    expect(mockMovieService.getMovies).toHaveBeenCalled();
    expect(component.movies).toEqual(mockMovies);
    expect(component.isMovieLoading).toBeFalse();
  });

  it('should handle movie loading error', () => {
    mockMovieService.getMovies.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.ngOnInit();
    expect(component.error).toBe('Failed to load movies');
    expect(component.isMovieLoading).toBeFalse();
  });

  it('should compare prices', () => {
    component.selectedMovieId = '1';
    mockMovieService.comparePrice.and.returnValue(of(mockFareComparison));
    component.onCompare();
    expect(mockMovieService.comparePrice).toHaveBeenCalledWith('1');
    expect(component.result).toEqual(mockFareComparison);
    expect(component.error).toBeUndefined();
  });

  it('should handle compare price error', () => {
    component.selectedMovieId = '1';
    mockMovieService.comparePrice.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.onCompare();
    expect(component.error).toBe('Comparison failed');
    expect(component.result).toBeUndefined();
  });

  it('should fetch movie details', () => {
    const movie: Movie = {
      id: '1',
      title: 'Movie A',
      type: 'Action',
      poster: 'poster1.jpg',
      year: '2023',
    };
    mockMovieService.getMovieDetails.and.returnValue(of(mockMovieDetails));
    component.fetchMovieDetails(movie);
    expect(mockMovieService.getMovieDetails).toHaveBeenCalledWith('1');
    expect(component.movieDetails).toEqual(mockMovieDetails);
    expect(component.error).toBeUndefined();
  });

  it('should handle movie detail fetch error', () => {
    const movie: Movie = {
      id: '2',
      title: 'Movie B',
      type: 'Action',
      poster: 'poster1.jpg',
      year: '2024',
    };
    mockMovieService.getMovieDetails.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.fetchMovieDetails(movie);
    expect(component.error).toBe('Movie details fetch failed');
    expect(component.movieDetails).toBeUndefined();
  });
});
