// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { VotingService } from '../../services/voting';
// import { AuthService } from '../../services/auth';

// @Component({
//   selector: 'app-results',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="min-h-screen bg-black">
//       <!-- Loading -->
//       <div *ngIf="loading" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50">
//         <div class="text-center">
//           <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
//           <p class="text-white text-xl">Loading results...</p>
//         </div>
//       </div>

//       <!-- Navigation -->
//       <div class="bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-600 sticky top-0 z-40">
//         <div class="container mx-auto px-8 py-4">
//           <div class="flex justify-between items-center">
//             <div class="flex gap-4">
//               <button (click)="goTo('/dashboard')" 
//                       class="px-8 py-3 rounded-xl font-semibold transition-all bg-gray-800/50 text-gray-300 hover:bg-gray-700">
//                 Dashboard
//               </button>
//               <button (click)="goTo('/voting')" 
//                       class="px-8 py-3 rounded-xl font-semibold transition-all bg-gray-800/50 text-gray-300 hover:bg-gray-700">
//                 Vote
//               </button>
//               <button (click)="goTo('/results')" 
//                       class="px-8 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg">
//                 Results
//               </button>
//             </div>
//             <button (click)="logout()" class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       <!-- Content -->
//       <div class="min-h-screen bg-gradient-to-br from-black to-gray-900 p-8">
//         <div class="max-w-7xl mx-auto">
//           <h1 class="text-5xl font-bold text-white mb-8">Live Results</h1>
          
//           <div class="grid gap-8">
//             <div *ngFor="let result of results" class="bg-gray-900 rounded-2xl p-8 border-2 border-white/20">
//               <div class="flex items-center gap-4 mb-6">
//                 <span class="text-5xl">{{getSeatIcon(result.seat)}}</span>
//                 <div>
//                   <h2 class="text-3xl font-bold text-white">{{result.name}}</h2>
//                   <p class="text-gray-400">Total Votes: {{result.total_votes}}</p>
//                 </div>
//               </div>
              
//               <div class="space-y-4">
//                 <div *ngFor="let c of result.candidates" class="bg-gray-800 rounded-lg p-4">
//                   <div class="flex justify-between items-center mb-2">
//                     <div>
//                       <h3 class="text-xl font-bold text-white">{{c.name}}</h3>
//                       <p class="text-gray-400 text-sm">{{c.party}}</p>
//                     </div>
//                     <div class="text-right">
//                       <p class="text-2xl font-bold text-green-400">{{c.votes}}</p>
//                       <p class="text-gray-400 text-sm">{{c.percentage}}%</p>
//                     </div>
//                   </div>
//                   <div class="w-full bg-gray-700 rounded-full h-3">
//                     <div class="bg-gradient-to-r from-red-600 to-green-600 h-3 rounded-full transition-all" 
//                          [style.width.%]="c.percentage"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: []
// })
// export class ResultsComponent implements OnInit {
//   results: any[] = [];
//   loading = false;
//   seats: any[] = [];

//   constructor(
//     private votingService: VotingService,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.loadSeats();
//     this.loadResults();
//   }

//   loadSeats() {
//     this.votingService.getSeats().subscribe({
//       next: (data) => this.seats = data
//     });
//   }

//   loadResults() {
//     this.loading = true;
    
//     this.votingService.getResults().subscribe({
//       next: (data) => {
//         this.loading = false;
//         this.results = data;
//       },
//       error: (err) => {
//         this.loading = false;
//         console.error('Failed to load results', err);
//       }
//     });
//   }

//   getSeatIcon(seatType: string): string {
//     const seat = this.seats.find(s => s.seat_type === seatType);
//     return seat?.icon || '🏛️';
//   }

//   goTo(route: string) {
//     this.router.navigate([route]);
//   }

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/']);
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth';

const SEAT_META: { [key: string]: { name: string; icon: string } } = {
  president:  { name: 'President',                icon: '🇰🇪' },
  governor:   { name: 'Governor',                  icon: '🏛️' },
  senator:    { name: 'Senator',                   icon: '⚖️'  },
  mp:         { name: 'Member of Parliament',      icon: '📋' },
  woman_rep:  { name: 'Woman Representative',      icon: '👩' },
  mca:        { name: 'Member of County Assembly', icon: '🏘️' }
};

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
        <div class="container mx-auto px-8 py-4 flex justify-between items-center">
          <div class="flex gap-4">
            <button (click)="goTo('/dashboard')" class="px-8 py-3 rounded-xl font-semibold bg-gray-800/50 text-gray-300 hover:bg-gray-700">Dashboard</button>
            <button (click)="goTo('/voting')" class="px-8 py-3 rounded-xl font-semibold bg-gray-800/50 text-gray-300 hover:bg-gray-700">Vote</button>
            <button (click)="goTo('/results')" class="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg">Results</button>
          </div>
          <button (click)="logout()" class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">Logout</button>
        </div>
      </div>

      <!-- Content -->
      <div class="min-h-screen bg-gradient-to-br from-black to-gray-900 p-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-5xl font-bold text-white">Live Results</h1>
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
              Live · refreshes every 30s
            </div>
          </div>

          <!-- Error -->
          <div *ngIf="errorMsg" class="bg-red-900/30 border border-red-500 rounded-xl p-6 mb-6 text-red-300">
            {{ errorMsg }}
          </div>

          <!-- Empty state -->
          <div *ngIf="!loading && results.length === 0 && !errorMsg" class="text-center text-gray-400 py-20">
            <div class="text-6xl mb-4">📊</div>
            <p class="text-xl">No results available yet.</p>
          </div>

          <div class="grid gap-8">
            <div *ngFor="let seat of results" class="bg-gray-900 rounded-2xl p-8 border-2 border-white/20">
              <div class="flex items-center gap-4 mb-6">
                <span class="text-5xl">{{ getSeatIcon(seat.seat_type) }}</span>
                <div>
                  <h2 class="text-3xl font-bold text-white">{{ getSeatName(seat.seat_type) }} — {{ seat.seat_name }}</h2>
                  <p class="text-gray-400">Total Votes: <span class="text-white font-bold">{{ getTotalVotes(seat) }}</span></p>
                </div>
              </div>

              <div class="space-y-4">
                <div *ngFor="let c of getSortedCandidates(seat); let i = index"
                     class="bg-gray-800 rounded-lg p-4 relative overflow-hidden"
                     [ngClass]="{ 'ring-2 ring-green-500': i === 0 && getTotalVotes(seat) > 0 }">
                  <div *ngIf="i === 0 && getTotalVotes(seat) > 0"
                       class="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    LEADING
                  </div>
                  <div class="flex justify-between items-center mb-2">
                    <div>
                      <h3 class="text-xl font-bold text-white">{{ c.full_name }}</h3>
                      <p class="text-gray-400 text-sm">{{ c.party }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-green-400">{{ c.votes }}</p>
                      <p class="text-gray-400 text-sm">{{ getPercentage(c.votes, getTotalVotes(seat)) | number:'1.1-1' }}%</p>
                    </div>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-3">
                    <div class="bg-gradient-to-r from-red-600 to-green-600 h-3 rounded-full transition-all duration-500"
                         [style.width.%]="getPercentage(c.votes, getTotalVotes(seat))"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .animate-pulse { animation: pulse 2s infinite; }
  `]
})
export class ResultsComponent implements OnInit, OnDestroy {
  results: any[] = [];
  loading = false;
  errorMsg = '';
  private refreshInterval: any;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadResults();
    this.refreshInterval = setInterval(() => this.loadResults(), 30000);
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval);
  }

  loadResults() {
    this.loading = this.results.length === 0;
    this.errorMsg = '';

    this.api.getResults().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.loading = false;
          this.results = data;
        }, 0);
      },
      error: (err) => {
        setTimeout(() => {
          this.loading = false;
          this.errorMsg = 'Failed to load results. Please try again.';
        }, 0);
        console.error(err);
      }
    });
  }

  getTotalVotes(seat: any): number {
    return seat.results?.reduce((sum: number, c: any) => sum + (c.votes || 0), 0) || 0;
  }

  getSortedCandidates(seat: any): any[] {
    return [...(seat.results || [])].sort((a, b) => b.votes - a.votes);
  }

  getPercentage(votes: number, total: number): number {
    return total > 0 ? Math.round((votes / total) * 1000) / 10 : 0;
  }

  getSeatIcon(seatType: string): string {
    return SEAT_META[seatType]?.icon || '🏛️';
  }

  getSeatName(seatType: string): string {
    return SEAT_META[seatType]?.name || seatType;
  }

  goTo(route: string) { this.router.navigate([route]); }
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}