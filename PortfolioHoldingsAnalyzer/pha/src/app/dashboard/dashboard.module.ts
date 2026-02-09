import { NgModule } from "@angular/core";
import { PortfolioService } from "../services/portfolio.service";
import { DashboardComponent } from "./dashboard.component";
import { CommonModule } from "@angular/common";
import { AgGridAngular } from "ag-grid-angular";
import { SummaryComponent } from './summary/summary.component';

@NgModule({
    imports: [CommonModule, AgGridAngular, SummaryComponent],
    declarations: [DashboardComponent],
    exports: [DashboardComponent],
    providers: [PortfolioService],
})

export class DashboardModule {}