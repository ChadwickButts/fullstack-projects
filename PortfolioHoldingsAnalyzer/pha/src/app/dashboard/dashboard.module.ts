import { NgModule } from "@angular/core";
import { PortfolioService } from "../services/portfolio.service";
import { DashboardComponent } from "./dashboard.component";
import { CommonModule } from "@angular/common";
import { AgGridAngular } from "ag-grid-angular";

@NgModule({
    imports: [CommonModule, AgGridAngular],
    declarations: [DashboardComponent],
    exports: [DashboardComponent],
    providers: [PortfolioService],
})

export class DashboardModule {}