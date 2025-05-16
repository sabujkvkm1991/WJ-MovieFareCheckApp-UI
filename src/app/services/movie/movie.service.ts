import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FareComparison } from '../../models/fare-comparison';
import { Movie } from '../../models/movie';
import { MovieDetails } from '../../models/movie-details';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MovieService {
  private apiUrl = `${environment.baseUrl}/MovieFare`; // Your .NET Web API base URL

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    var data = this.http.get<Movie[]>(`${this.apiUrl}/GetAllMovies`)
    return data;
  }

  comparePrice(movieId: string): Observable<FareComparison> {
    return this.http.get<FareComparison>(`${this.apiUrl}/compare/${movieId}`);
  }

  getMovieDetails(movieId: string): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.apiUrl}/GetMovieDetailsById/${movieId}`);
  }
}
