import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { Movie } from '../../models/movie';
import { FareComparison } from '../../models/fare-comparison';
import { MovieDetails } from '../../models/movie-details';
import { environment } from '../../../environments/environment';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingController],
      providers: [MovieService],
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // verify no unmatched requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

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

    const req = httpMock.expectOne(`${environment.baseUrl}/GetAllMovies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

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

    const req = httpMock.expectOne(
      `${environment.baseUrl}/GetMovieDetailsById/1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockDetails);
  });

  it('should compare movie prices', () => {
    const mockComparison: FareComparison = {
      provider: 'CinemaWorld',
      movieId: '1',
      title: 'Inception',
      cheapestPrice: '10',
    };

    service.comparePrice('1').subscribe((data) => {
      expect(data.provider).toBe('FilmWorld');
      expect(data.cheapestPrice).toBe('10');
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/compare/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComparison);
  });
});
