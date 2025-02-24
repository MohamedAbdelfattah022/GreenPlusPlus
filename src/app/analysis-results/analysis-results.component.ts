import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  LineChart,
  BarChart,
  Activity,
} from 'lucide-angular';

@Component({
  selector: 'app-analysis-results',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analysis-results.component.html',
  styleUrls: ['./analysis-results.component.css'],
})
export class AnalysisResultsComponent {
  @Input() results: {
    energyUsage: number;
    recommendations: string[];
    simulationData: {
      month: string;
      usage: number;
    }[];
  } = {
    energyUsage: 0,
    recommendations: [],
    simulationData: [],
  };

  readonly Activity = Activity;
  readonly LineChart = LineChart;
  readonly BarChart = BarChart;
}
