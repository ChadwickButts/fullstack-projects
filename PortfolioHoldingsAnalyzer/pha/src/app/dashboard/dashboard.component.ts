import { Component, OnInit } from '@angular/core';
import { Position } from '../model/position.model';
import { PortfolioService } from '../services/portfolio.service';
import { ColDef } from 'ag-grid-community';
import { catchError, map, Observable, of, scan, take } from 'rxjs';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})

export class DashboardComponent implements OnInit {
  positions$!: Observable<Position[]>;
  messageReceived: string = '';
  tickers: string[] = []

  constructor(private portfolioService: PortfolioService) { }
  
  ngOnInit(): void {
    this.positions$ = this.portfolioService.getPositions();
  }

  childMessageReceived(value: string) {
    this.messageReceived = value;
  }

  getTickers() {
    this.positions$.pipe(
      map( position => position.map(ticks => ticks.ticker)),
      catchError((error) => { 
        console.log('Error Log: ', error)
        return of();
      })
    ).subscribe(result => {
      this.tickers = result
    })
  }
  defaultColDef: ColDef = {
    width: 160
  }

  colDefs: ColDef[] = [
    { field: "ticker" },
    { field: "name" },
    { field: "sector" },
    { field: "shares" },
    { field: "costBasis" },
    { field: "marketPrice" },
    { field: "marketValue" },
    { field: "gainLossPct" }
  ]
}
