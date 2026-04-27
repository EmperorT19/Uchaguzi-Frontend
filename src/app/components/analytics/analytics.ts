import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { COUNTIES, CONSTITUENCIES } from '../../utils/locations';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit {
  // Cascading Filter Data
  provinces = ['Coast', 'North Eastern', 'Eastern', 'Central', 'Rift Valley', 'Western', 'Nyanza', 'Nairobi'];
  
  // A simplified mapping for UI purposes
  countyMap: { [key: string]: number[] } = {
    'Coast': [1,2,3,4,5,6],
    'North Eastern': [7,8,9],
    'Eastern': [10,11,12,13,14,15,16,17],
    'Central': [18,19,20,21,22],
    'Rift Valley': [23,24,25,26,27,28,29,30,31,32,33,34,35,36],
    'Western': [37,38,39,40],
    'Nyanza': [41,42,43,44,45,46],
    'Nairobi': [47]
  };

  selectedProvince = '';
  selectedCounty = '';
  selectedConstituency = '';

  availableCounties: any[] = [];
  availableConstituencies: any[] = [];

  // Data
  allCandidatesData: any = {};
  seatTypes = ['president', 'governor', 'senator', 'woman_rep', 'mp', 'mca'];

  @ViewChild('overviewChart') overviewChartRef!: ElementRef;
  overviewChartInstance: any;
  seatChartInstances: { [key: string]: any } = {};
  
  constructor(private http: HttpClient, private router: Router, public translation: TranslationService) {}

  ngOnInit() {
    this.setupThemeListener();
    this.fetchAllCandidates();
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

  onProvinceChange() {
    this.selectedCounty = '';
    this.selectedConstituency = '';
    if (this.selectedProvince) {
      const countyIds = this.countyMap[this.selectedProvince] || [];
      this.availableCounties = COUNTIES.filter(c => countyIds.includes(c.id));
    } else {
      this.availableCounties = [];
    }
    this.availableConstituencies = [];
    this.fetchAllCandidates();
  }

  onCountyChange() {
    this.selectedConstituency = '';
    if (this.selectedCounty) {
       this.availableConstituencies = CONSTITUENCIES.filter(c => c.countyId == +this.selectedCounty);
    } else {
       this.availableConstituencies = [];
    }
    this.fetchAllCandidates();
  }

  onConstituencyChange() {
    this.fetchAllCandidates();
  }

  fetchAllCandidates() {
    let url = 'http://127.0.0.1:8000/results/all_candidates?';
    if (this.selectedConstituency) {
      url += `constituency=${this.selectedConstituency}`;
    } else if (this.selectedCounty) {
      url += `county=${this.selectedCounty}`;
    } else if (this.selectedProvince) {
      url += `province=${this.selectedProvince}`;
    }

    this.http.get<any>(url).subscribe(data => {
      this.allCandidatesData = data;
      this.renderOverviewChart();
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
