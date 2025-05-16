import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailsComponent } from './movie-details.component';
import { MatCardModule } from '@angular/material/card';
import { MovieDetails } from '../../models/movie-details';

describe('MovieDetailsComponent', () => {
  let component: MovieDetailsComponent;
  let fixture: ComponentFixture<MovieDetailsComponent>;

  const mockMovieDetails: MovieDetails = {
    title: 'Inception',
    year: '2010',
    genre: 'Sci-Fi',
    director: 'Christopher Nolan',
    actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page',
    plot: 'A thief who steals corporate secrets through dream-sharing.',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailsComponent, MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display movie details correctly', () => {
    component.details = mockMovieDetails;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Inception');
    expect(compiled.textContent).toContain('2010');
    expect(compiled.textContent).toContain('Sci-Fi');
    expect(compiled.textContent).toContain('Christopher Nolan');
    expect(compiled.textContent).toContain('Leonardo DiCaprio');
    expect(compiled.textContent).toContain('dream-sharing');

    const img = compiled.querySelector('img');
    if (img) {
      expect(img.getAttribute('src')).toBe(mockMovieDetails.poster);
    }
  });
});
