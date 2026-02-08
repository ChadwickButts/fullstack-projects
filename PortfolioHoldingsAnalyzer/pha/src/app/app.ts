import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DashboardModule } from './dashboard/dashboard.module';

@Component({
  selector: 'app-root',
  imports: [DashboardModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio-holdings-analyzer');
}
