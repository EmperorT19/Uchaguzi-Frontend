import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { COUNTIES, CONSTITUENCIES } from '../../utils/locations';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth';
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  availableCounties: any[] = [];
  availableConstituencies: any[] = [];

  // Data
  allCandidatesData: any = {};
  seatTypes = ['president', 'governor', 'senator', 'woman_rep', 'mp', 'mca'];

  @ViewChild('overviewChart') overviewChartRef!: ElementRef;
  overviewChartInstance: any;
  seatChartInstances: { [key: string]: any } = {};
  
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService,
    public translation: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  private langChangedHandler = () => {
    this.renderOverviewChart();
  };

  ngOnInit() {
    window.addEventListener('langChanged', this.langChangedHandler);
    this.setupThemeListener();
    this.fetchAllCandidates();
  }

  ngOnDestroy() {
    window.removeEventListener('langChanged', this.langChangedHandler);
  }

  setupThemeListener() {
    // Set initial chart theme based on current root data-theme
    this.updateChartTheme(document.documentElement.getAttribute('data-theme') === 'dark');

    // Listen for custom themeChanged events
    window.addEventListener('themeChanged', ((e: CustomEvent) => {
      this.updateChartTheme(e.detail.isDark);
      this.renderOverviewChart(); // Re-render to apply new defaults
    }) as EventListener);
  }

  updateChartTheme(isDark: boolean) {
    if (isDark) {
      Chart.defaults.color = '#9ca3af'; // text-secondary dark
      Chart.defaults.borderColor = '#374151'; // border-color dark
    } else {
      Chart.defaults.color = '#6b7280'; // text-secondary light
      Chart.defaults.borderColor = '#e5e7eb'; // border-color light
    }
  }

  fetchAllCandidates() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://127.0.0.1:8000' 
      : 'https://web-production-a0d6df.up.railway.app';
    
    // Scoped fetch: analytics only shows user's relevant candidates
    let url = `${baseUrl}/results/all_candidates?county=${user.county}&constituency=${user.constituency}&ward=${user.ward}`;

    this.http.get<any>(url).subscribe(data => {
      this.allCandidatesData = data;
      this.renderOverviewChart();
      // Sync Logic: Automatically redraws any expanded seat charts when new data arrives
      this.refreshAllVisibleCharts();
      this.cdr.detectChanges();
    });
  }

  refreshAllVisibleCharts() {
    this.seatTypes.forEach(seat => {
      const details = document.querySelector(`details#details-${seat}`) as any;
      if (details && details.open) {
        this.renderSeatChart(seat);
      }
    });
  }

  renderOverviewChart() {
    if (!this.overviewChartRef) return;
    
    // We'll chart the Presidential race as the primary overview
    const presidentData = this.allCandidatesData['president'] || [];
    
    const labels = presidentData.map((c: any) => c.candidate);
    const data = presidentData.map((c: any) => c.votes);

    if (this.overviewChartInstance) this.overviewChartInstance.destroy();

    this.overviewChartInstance = new Chart(this.overviewChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Presidential Votes',
          data: data,
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  renderSeatChart(seat: string) {
    setTimeout(() => {
      const canvas = document.getElementById(`chart-${seat}`) as HTMLCanvasElement;
      if (!canvas) return;

      const seatData = this.allCandidatesData[seat] || [];
      const labels = seatData.map((c: any) => c.candidate);
      const data = seatData.map((c: any) => c.votes);

      if (this.seatChartInstances[seat]) {
        this.seatChartInstances[seat].destroy();
      }

      this.seatChartInstances[seat] = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: `${this.t('seat_' + seat)} Votes`,
            data: data,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }, 100); // small delay to allow details tag to expand and canvas to be ready
  }

  t(key: string): string {
    return this.translation.t(key);
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
