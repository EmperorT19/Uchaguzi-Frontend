import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth';
import { CONSTITUENCIES } from '../../shared/constituencies';
Chart.register(...registerables);

// Province → County ID mappings for filter
const PROVINCES: { [key: string]: { name: string; counties: number[] } } = {
  'Coast':    { name: 'Coast',    counties: [1, 2, 3, 4, 5, 6] },
  'North Eastern': { name: 'North Eastern', counties: [7, 8, 9] },
  'Eastern':  { name: 'Eastern',  counties: [10, 11, 12, 13, 14, 15, 16, 17] },
  'Central':  { name: 'Central',  counties: [18, 19, 20, 21, 22] },
  'Rift Valley': { name: 'Rift Valley', counties: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36] },
  'Western':  { name: 'Western',  counties: [37, 38, 39, 40] },
  'Nyanza':   { name: 'Nyanza',   counties: [41, 42, 43, 44, 45, 46] },
  'Nairobi':  { name: 'Nairobi',  counties: [47] }
};

const COUNTY_NAMES: { [key: number]: string } = {
  1: 'Mombasa', 2: 'Kwale', 3: 'Kilifi', 4: 'Tana River', 5: 'Lamu', 6: 'Taita-Taveta',
  7: 'Garissa', 8: 'Wajir', 9: 'Mandera', 10: 'Marsabit', 11: 'Isiolo', 12: 'Meru',
  13: 'Tharaka-Nithi', 14: 'Embu', 15: 'Kitui', 16: 'Machakos', 17: 'Makueni',
  18: 'Nyandarua', 19: 'Nyeri', 20: 'Kirinyaga', 21: "Murang'a", 22: 'Kiambu',
  23: 'Turkana', 24: 'West Pokot', 25: 'Samburu', 26: 'Trans-Nzoia', 27: 'Uasin Gishu',
  28: 'Elgeyo-Marakwet', 29: 'Nandi', 30: 'Baringo', 31: 'Laikipia', 32: 'Nakuru',
  33: 'Narok', 34: 'Kajiado', 35: 'Kericho', 36: 'Bomet', 37: 'Kakamega', 38: 'Vihiga',
  39: 'Bungoma', 40: 'Busia', 41: 'Siaya', 42: 'Kisumu', 43: 'Homa Bay', 44: 'Migori',
  45: 'Kisii', 46: 'Nyamira', 47: 'Nairobi'
};

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  // Filter state
  selectedProvince: string = '';
  selectedCounty: string = '';
  selectedConstituency: string = '';
  selectedWard: string = '';
  selectedSeatType: string = '';
  
  provinces = Object.keys(PROVINCES);
  availableCounties: { id: number; name: string }[] = [];
  availableConstituencies: { id: number; name: string; countyId: number }[] = [];
  availableWards: { id: number; name: string; constituency_id: number }[] = [];

  // Data
  allCandidatesData: any = {};
  seatTypes = ['president', 'governor', 'senator', 'woman_rep', 'mp', 'mca'];
  loading = false;
  refreshInterval: any;

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
    // Load data for user's region immediately
    this.fetchAllCandidates();
  }

  ngOnDestroy() {
    window.removeEventListener('langChanged', this.langChangedHandler);
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  setupThemeListener() {
    this.updateChartTheme(document.documentElement.getAttribute('data-theme') === 'dark');
    window.addEventListener('themeChanged', ((e: CustomEvent) => {
      this.updateChartTheme(e.detail.isDark);
      this.renderOverviewChart();
    }) as EventListener);
  }

  updateChartTheme(isDark: boolean) {
    if (isDark) {
      Chart.defaults.color = '#9ca3af';
      Chart.defaults.borderColor = '#374151';
    } else {
      Chart.defaults.color = '#6b7280';
      Chart.defaults.borderColor = '#e5e7eb';
    }
  }

  onProvinceChange() {
    this.selectedCounty = '';
    this.selectedConstituency = '';
    this.selectedWard = '';
    this.availableWards = [];
    if (this.selectedProvince && PROVINCES[this.selectedProvince]) {
      this.availableCounties = PROVINCES[this.selectedProvince].counties.map(id => ({
        id, name: COUNTY_NAMES[id] || `County ${id}`
      }));
    } else {
      this.availableCounties = [];
    }
    this.fetchAllCandidates();
  }

  onCountyChange() {
    this.selectedConstituency = '';
    this.selectedWard = '';
    this.availableWards = [];
    if (this.selectedCounty) {
      this.availableConstituencies = CONSTITUENCIES.filter(c => c.countyId.toString() === this.selectedCounty.toString());
    } else {
      this.availableConstituencies = [];
    }
    this.fetchAllCandidates();
  }

  onConstituencyChange() {
    this.selectedWard = '';
    this.availableWards = [];
    if (this.selectedConstituency) {
      const baseUrl = window.location.hostname === 'localhost' 
        ? 'http://127.0.0.1:8000' 
        : 'https://web-production-a0d6df.up.railway.app';
      this.http.get<any>(`${baseUrl}/wards/?constituency=${this.selectedConstituency}`).subscribe(res => {
        this.availableWards = res;
      });
    }
    this.fetchAllCandidates();
  }

  onWardChange() {
    this.fetchAllCandidates();
  }

  onSeatTypeChange() {
    // Just re-render — data is already filtered in the template
    this.cdr.detectChanges();
  }

  get filteredSeatTypes(): string[] {
    if (this.selectedSeatType) return [this.selectedSeatType];
    return this.seatTypes;
  }

  get regionLabel(): string {
    if (this.selectedWard) {
      const w = this.availableWards.find(x => x.id.toString() === this.selectedWard.toString());
      return w ? `${w.name} Ward` : `Ward ${this.selectedWard}`;
    }
    if (this.selectedConstituency) {
      const c = CONSTITUENCIES.find(x => x.id.toString() === this.selectedConstituency.toString());
      return c ? `${c.name} Constituency` : `Constituency ${this.selectedConstituency}`;
    }
    if (this.selectedCounty) {
      return COUNTY_NAMES[parseInt(this.selectedCounty)] || `County ${this.selectedCounty}`;
    }
    if (this.selectedProvince) return this.selectedProvince + ' Province';
    return 'National Votes';
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
    
    this.loading = true;
    
    // Build query params based on filters
    let params: string[] = [];
    
    if (this.selectedWard) {
      params.push(`ward=${this.selectedWard}`);
    } else if (this.selectedConstituency) {
      params.push(`constituency=${this.selectedConstituency}`);
    } else if (this.selectedCounty) {
      params.push(`county=${this.selectedCounty}`);
    } else if (this.selectedProvince) {
      params.push(`province=${this.selectedProvince}`);
    }
    // No else — when no filter is selected, send no params = national overview

    let url = `${baseUrl}/results/all_candidates?${params.join('&')}`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.allCandidatesData = data;
        this.loading = false;
        this.renderOverviewChart();
        this.refreshAllVisibleCharts();
        this.cdr.detectChanges();
        // Start auto-refresh after first load
        this.startPolling();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startPolling() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      this.silentRefresh();
    }, 15000);
  }

  silentRefresh() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://127.0.0.1:8000' 
      : 'https://web-production-a0d6df.up.railway.app';

    let params: string[] = [];
    if (this.selectedWard) {
      params.push(`ward=${this.selectedWard}`);
    } else if (this.selectedConstituency) {
      params.push(`constituency=${this.selectedConstituency}`);
    } else if (this.selectedCounty) {
      params.push(`county=${this.selectedCounty}`);
    } else if (this.selectedProvince) {
      params.push(`province=${this.selectedProvince}`);
    }

    let url = `${baseUrl}/results/all_candidates${params.length ? '?' + params.join('&') : ''}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.allCandidatesData = data;
        this.renderOverviewChart();
        this.refreshAllVisibleCharts();
        this.cdr.detectChanges();
      }
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
    
    const presidentData = this.allCandidatesData['president'] || [];
    const labels = presidentData.map((c: any) => c.candidate);
    const data = presidentData.map((c: any) => c.votes);

    if (this.overviewChartInstance) this.overviewChartInstance.destroy();

    this.overviewChartInstance = new Chart(this.overviewChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.t('seat_president') + ' ' + this.t('votes'),
          data: data,
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  renderSeatChart(seat: string) {
    setTimeout(() => {
      const canvas = document.getElementById(`chart-${seat}`) as HTMLCanvasElement;
      if (!canvas) return;

      const seatData = this.allCandidatesData[seat] || [];
      // Take top 15 candidates for chart readability
      const topCandidates = seatData.slice(0, 15);
      const labels = topCandidates.map((c: any) => c.candidate);
      const data = topCandidates.map((c: any) => c.votes);

      if (this.seatChartInstances[seat]) {
        this.seatChartInstances[seat].destroy();
      }

      this.seatChartInstances[seat] = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: `${this.t('seat_' + seat)} ${this.t('votes')}`,
            data: data,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }, 150);
  }

  getTotalVotesForSeat(seat: string): number {
    const data = this.allCandidatesData[seat] || [];
    return data.reduce((sum: number, c: any) => sum + (c.votes || 0), 0);
  }

  getCandidateCount(seat: string): number {
    return (this.allCandidatesData[seat] || []).length;
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
