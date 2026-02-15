import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VotingService } from '../../services/voting';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Loading -->
      <div *ngIf="loading" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p class="text-white text-xl">Loading results...</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-600 sticky top-0 z-40">
        <div class="container mx-auto px-8 py-4">
          <div class="flex justify-between items-center">
            <div class="flex gap-4">
              <button (click)="goTo('/dashboard')" 
                      class="px-8 py-3 rounded-xl font-semibold transition-all bg-gray-800/50 text-gray-300 hover:bg-gray-700">
                Dashboard
              </button>
              <button (click)="goTo('/voting')" 
                      class="px-8 py-3 rounded-xl font-semibold transition-all bg-gray-800/50 text-gray-300 hover:bg-gray-700">
                Vote
              </button>
              <button (click)="goTo('/results')" 
                      class="px-8 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg">
                Results
              </button>
            </div>
            <button (click)="logout()" class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="min-h-screen bg-gradient-to-br from-black to-gray-900 p-8">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-5xl font-bold text-white mb-8">Live Results</h1>
          
          <div class="grid gap-8">
            <div *ngFor="let result of results" class="bg-gray-900 rounded-2xl p-8 border-2 border-white/20">
              <div class="flex items-center gap-4 mb-6">
                <span class="text-5xl">{{getSeatIcon(result.seat)}}</span>
                <div>
                  <h2 class="text-3xl font-bold text-white">{{result.name}}</h2>
                  <p class="text-gray-400">Total Votes: {{result.total_votes}}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div *ngFor="let c of result.candidates" class="bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center mb-2">
                    <div>
                      <h3 class="text-xl font-bold text-white">{{c.name}}</h3>
                      <p class="text-gray-400 text-sm">{{c.party}}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-green-400">{{c.votes}}</p>
                      <p class="text-gray-400 text-sm">{{c.percentage}}%</p>
                    </div>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-3">
                    <div class="bg-gradient-to-r from-red-600 to-green-600 h-3 rounded-full transition-all" 
                         [style.width.%]="c.percentage"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  loading = false;
  seats: any[] = [];

  constructor(
    private votingService: VotingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSeats();
    this.loadResults();
  }

  loadSeats() {
    this.votingService.getSeats().subscribe({
      next: (data) => this.seats = data
    });
  }

  loadResults() {
    this.loading = true;
    
    this.votingService.getResults().subscribe({
      next: (data) => {
        this.loading = false;
        this.results = data;
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load results', err);
      }
    });
  }

  getSeatIcon(seatType: string): string {
    const seat = this.seats.find(s => s.seat_type === seatType);
    return seat?.icon || '🏛️';
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}