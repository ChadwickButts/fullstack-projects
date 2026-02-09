import { Component } from '@angular/core';
import { Position } from '../model/position.model';
import { PortfolioService } from '../services/portfolio.service';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})

export class DashboardComponent {
  positions$!: Observable<Position[]>;

  constructor(private portfolioService: PortfolioService) { 
    this.positions$ = this.portfolioService.getPositions();
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
