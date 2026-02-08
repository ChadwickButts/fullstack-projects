import { Injectable } from '@angular/core';
import { Position } from '../model/position.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const BASE_PATH = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) { }
  
  /* can also inject service with inject function starting with v14
  private http = inject(HttpClient)
  */

  getPositions() : Observable<Position[]> {
    return this.http.get<Position[]>(`${BASE_PATH}/positions`);
  }

  getPositionByTicker(ticker: string) : Observable<Position> | undefined {
    return this.http.get<Position>(`${BASE_PATH}/positions`).pipe(
      filter(val => val.ticker === ticker)
    )
  }
}
