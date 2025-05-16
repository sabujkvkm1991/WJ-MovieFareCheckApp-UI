import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ComparePriceComponent } from './compare-price.component';
import { MovieService } from '../../services/movie/movie.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieSelectorComponent } from '../../components/movie-selector/movie-selector.component';
import { MovieBestPriceComponent } from '../../components/movie-best-price/movie-best-price.component';
import { MovieDetailsComponent } from '../../components/movie-details/movie-details.component';
import { Movie } from '../../models/movie';
import { FareComparison } from '../../models/fare-comparison';
import { MovieDetails } from '../../models/movie-details';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth/auth.service';

describe('ComparePriceComponent (Standalone)', () => {
  let fixture: ComponentFixture<ComparePriceComponent>;
  let component: ComparePriceComponent;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockMovies: Movie[] = [
    {
      id: '1',
      title: 'Movie A',
      type: 'Action',
      poster: 'poster.jpg',
      year: '2023',
    },
  ];

  const mockFareComparison: FareComparison = {
    movieId: '1',
    provider: 'TestProvider',
    title: 'Movie A',
    cheapestPrice: '15.99',
  };

  const mockDetails: MovieDetails = {
    ...mockMovies[0],
    plot: 'Some plot',
    rating: '8.2',
    director: 'Director X',
    genre: 'Action',
    actors: 'Actor A, Actor B',
    language: 'English',
    country: 'USA',
    metascore: '75',
    price: 129,
    rated: 'PG-13',
    released: '2023-01-01',
    runtime: '120 min',
    votes: '5000',
    writer: 'Writer X',
  };

  beforeEach(waitForAsync(() => {
    movieServiceSpy = jasmine.createSpyObj<MovieService>('MovieService', [
      'getMovies',
      'comparePrice',
      'getMovieDetails',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'logout',
    ]);

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        ComparePriceComponent,
        MatButtonModule,
        MatProgressSpinnerModule,
        MovieSelectorComponent,
        MovieBestPriceComponent,
        MovieDetailsComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparePriceComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    movieServiceSpy.getMovies.and.returnValue(of(mockMovies));
    fixture.detectChanges();
    expect(movieServiceSpy.getMovies).toHaveBeenCalled();
    expect(component.movies).toEqual(mockMovies);
    expect(component.isMovieLoading).toBeFalse();
  });

  it('should handle movie load error', () => {
    movieServiceSpy.getMovies.and.returnValue(
      throwError(() => new Error('error'))
    );
    fixture.detectChanges();
    expect(component.error).toBe('Failed to load movies');
    expect(component.isMovieLoading).toBeFalse();
  });

  it('should fetch movie details', () => {
    movieServiceSpy.getMovieDetails.and.returnValue(of(mockDetails));
    component.fetchMovieDetails(mockMovies[0]);
    expect(component.movieDetails).toEqual(mockDetails);
    expect(component.selectedMovieId).toBe('1');
    expect(component.error).toBeUndefined();
  });

  it('should handle movie details error', () => {
    movieServiceSpy.getMovieDetails.and.returnValue(
      throwError(() => new Error('fail'))
    );
    component.fetchMovieDetails(mockMovies[0]);
    expect(component.movieDetails).toBeUndefined();
    expect(component.error).toBe('Movie details fetch failed');
  });

  it('should compare prices when selectedMovieId is set', () => {
    component.selectedMovieId = '1';
    movieServiceSpy.comparePrice.and.returnValue(of(mockFareComparison));
    component.onCompare();
    expect(movieServiceSpy.comparePrice).toHaveBeenCalledWith('1');
    expect(component.result).toEqual(mockFareComparison);
    expect(component.error).toBeUndefined();
  });

  it('should not compare prices when no selectedMovieId is set', () => {
    component.selectedMovieId = '';
    component.onCompare();
    expect(movieServiceSpy.comparePrice).not.toHaveBeenCalled();
  });

  it('should handle compare price error', () => {
    component.selectedMovieId = '1';
    movieServiceSpy.comparePrice.and.returnValue(
      throwError(() => new Error('fail'))
    );
    component.onCompare();
    expect(component.result).toBeUndefined();
    expect(component.error).toBe('Comparison failed');
  });

  it('should logout and navigate to login', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
