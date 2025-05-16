import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieBestPriceComponent } from './movie-best-price.component';
import { FareComparison } from '../../models/fare-comparison';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Component } from '@angular/core';

describe('MovieBestPriceComponent', () => {
  let component: MovieBestPriceComponent;
  let fixture: ComponentFixture<MovieBestPriceComponent>;

  const mockData: FareComparison = {
    provider: 'CinemaWorld',
    cheapestPrice: '10',
    movieId: '12345',
    title: 'Inception',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieBestPriceComponent, MatCardModule, CurrencyPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieBestPriceComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind and display fare comparison data correctly', () => {
    component.fareComparison = mockData;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('CinemaWorld');
    expect(compiled.textContent).toContain('FilmWorld');
    expect(compiled.textContent).toContain('8'); // price
    expect(compiled.textContent).toContain('FilmWorld'); // cheapest provider
  });
});
