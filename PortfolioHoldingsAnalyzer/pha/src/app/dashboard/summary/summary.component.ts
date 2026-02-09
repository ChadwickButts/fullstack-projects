import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { Position } from '../../model/position.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SummaryComponent implements OnInit {

  @Input() positions!: Position[];
  @Output() messageEvent = new EventEmitter<string>();

  totalMarketValue: number = 0;

  ngOnInit(): void {
     for (let position of this.positions) {
      this.totalMarketValue += position.marketValue
     }

     this.messageEvent.emit('Market Value Calculated!')
  }

}
