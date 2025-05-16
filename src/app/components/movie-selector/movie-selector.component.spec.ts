import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieSelectorComponent } from './movie-selector.component';
import { Movie } from '../../models/movie';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MovieSelectorComponent', () => {
  let component: MovieSelectorComponent;
  let fixture: ComponentFixture<MovieSelectorComponent>;

  const mockMovies: Movie[] = [
    {
      id: '1',
      title: 'Movie One',
      type: 'Action',
      poster: 'poster1.jpg',
      year: '2023',
    },
    {
      id: '2',
      title: 'Movie Two',
      type: 'Sc-fi',
      poster: 'poster2.jpg',
      year: '2024',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MovieSelectorComponent,
        FormsModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieSelectorComponent);
    component = fixture.componentInstance;
    component.movies = mockMovies;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive movies input', () => {
    expect(component.movies.length).toBe(2);
    expect(component.movies[0].title).toBe('Movie One');
  });

  it('should emit selected movie', () => {
    spyOn(component.movieSelected, 'emit');

    const selectedMovie = mockMovies[1];
    component.onSelectMovie(selectedMovie);

    expect(component.movieSelected.emit).toHaveBeenCalledWith(selectedMovie);
  });
});
