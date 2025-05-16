import { TestBed } from '@angular/core/testing';
import { MovieService } from './movie.service';
import { Movie } from '../../models/movie';
import { FareComparison } from '../../models/fare-comparison';
import { MovieDetails } from '../../models/movie-details';
import { environment } from '../../../environments/environment';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseUrl}/MovieFare`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MovieService,
      ],
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMovies', () => {
    it('should fetch all movies', () => {
      const mockMovies: Movie[] = [
        {
          id: '1',
          title: 'Inception',
          poster: 'https://example.com/inception.jpg',
          year: '2010',
          type: 'Sci-Fi',
        },
        {
          id: '2',
          title: 'The Matrix',
          poster: 'https://example.com/matrix.jpg',
          year: '1999',
          type: 'Action',
        },
      ];

      service.getMovies().subscribe((movies) => {
        expect(movies.length).toBe(2);
        expect(movies).toEqual(mockMovies);
      });

      const req = httpMock.expectOne(`${baseUrl}/GetAllMovies`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovies);
    });

    it('should handle error when fetching movies', (done) => {
      service.getMovies().subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/GetAllMovies`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details by ID', () => {
      const mockDetails: MovieDetails = {
        title: 'Inception',
        year: '2010',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
        plot: 'Dream-inception concept.',
        poster: 'https://example.com/inception.jpg',
        country: 'USA',
        id: 'tt1375666',
        language: 'English',
        metascore: '74',
        price: 10.0,
        rating: '8.8',
        runtime: '148 min',
        rated: 'PG-13',
        released: '2010-07-16',
        writer: 'Christopher Nolan',
        type: 'movie',
        votes: '1,000,000',
      };

      service.getMovieDetails('1').subscribe((details) => {
        expect(details.title).toBe('Inception');
        expect(details.director).toContain('Nolan');
      });

      const req = httpMock.expectOne(`${baseUrl}/GetMovieDetailsById/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDetails);
    });
  });

  describe('comparePrice', () => {
    it('should compare movie prices by movie ID', () => {
      const mockComparison: FareComparison = {
        provider: 'CinemaWorld',
        movieId: '1',
        title: 'Inception',
        cheapestPrice: '10',
      };

      service.comparePrice('1').subscribe((data) => {
        expect(data.provider).toBe('CinemaWorld');
        expect(data.cheapestPrice).toBe('10');
      });

      const req = httpMock.expectOne(`${baseUrl}/compare/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComparison);
    });
  });
});
