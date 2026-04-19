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

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

const I18N: any = {
  en: {
    dashboard: 'Dashboard', vote: 'Vote', results: 'Results', logout: 'Logout',
    liveResults: 'Live Results', liveRefreshes: 'Live · refreshes every 2s',
    noResults: 'No results available yet.', totalVotes: 'Total Votes:', leading: 'LEADING',
    loginToView: 'Please login to view your results.', failedToLoad: 'Failed to load results. Please try again.',
    trendingParties: 'Trending Parties', votes: 'votes',
    seat_president: 'President', seat_governor: 'Governor', seat_senator: 'Senator',
    seat_mp: 'Member of Parliament', seat_woman_rep: 'Woman Representative', seat_mca: 'Member of County Assembly'
  },
  sw: {
    dashboard: 'Dashibodi', vote: 'Kura', results: 'Matokeo', logout: 'Toka',
    liveResults: 'Matokeo Moja kwa Moja', liveRefreshes: 'Moja kwa moja · inasasishwa kila 2s',
    noResults: 'Hakuna matokeo yaliyopatikana bado.', totalVotes: 'Jumla ya Kura:', leading: 'KIONGOZI',
    loginToView: 'Tafadhali ingia ili uone matokeo yako.', failedToLoad: 'Imeshindwa kupakia matokeo. Jaribu tena.',
    trendingParties: 'Vyama Vinavyovuma', votes: 'kura',
    seat_president: 'Rais', seat_governor: 'Gavana', seat_senator: 'Seneta',
    seat_mp: 'Mbunge', seat_woman_rep: 'Mwakilishi wa Wanawake', seat_mca: 'Mwakilishi wa Wodi'
  }
};

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Loading Skeleton -->
      <div *ngIf="loading" class="fixed inset-0 bg-black/90 backdrop-blur z-50 p-8 overflow-y-auto pt-24 text-center">
        <div class="max-w-7xl mx-auto">
          <div class="h-16 bg-gray-800/80 w-1/4 rounded-2xl mb-12 animate-pulse"></div>
          <div class="grid gap-8">
            <div class="bg-gray-900 rounded-2xl p-8 border-2 border-white/5 animate-pulse" *ngFor="let _ of [1,2]">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-gray-800 rounded-full"></div>
                <div class="h-10 bg-gray-800 rounded w-1/2"></div>
              </div>
              <div class="h-20 bg-gray-800 rounded-lg mb-4"></div>
              <div class="h-20 bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-600 sticky top-0 z-40">
        <div class="container mx-auto px-8 py-4 flex justify-between items-center">
          <div class="flex gap-4">
            <button (click)="goTo('/dashboard')" class="px-8 py-3 rounded-xl font-semibold bg-gray-800/50 text-gray-300 hover:bg-gray-700">{{t('dashboard')}}</button>
            <button (click)="goTo('/voting')" class="px-8 py-3 rounded-xl font-semibold bg-gray-800/50 text-gray-300 hover:bg-gray-700">{{t('vote')}}</button>
            <button (click)="goTo('/results')" class="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg">{{t('results')}}</button>
          </div>
          <div class="flex gap-4 items-center">
            <button (click)="toggleLang()" class="px-4 py-2 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition">
              {{ lang === 'en' ? 'SW' : 'EN' }}
            </button>
            <button (click)="logout()" class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">{{t('logout')}}</button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="min-h-screen bg-gradient-to-br from-black to-gray-900 p-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-5xl font-bold text-white">{{t('liveResults')}}</h1>
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
              {{t('liveRefreshes')}}
            </div>
          </div>

          <!-- Error -->
          <div *ngIf="errorMsg" class="bg-red-900/30 border border-red-500 rounded-xl p-6 mb-6 text-red-300">
            {{ errorMsg }}
          </div>

          <!-- Empty state -->
          <div *ngIf="!loading && results.length === 0 && !errorMsg" class="text-center text-gray-400 py-20">
            <div class="text-6xl mb-4">📊</div>
            <p class="text-xl">{{t('noResults')}}</p>
          </div>

          <!-- Trending Party Leaderboard -->
          <div *ngIf="trendingParties.length > 0" class="mb-10 bg-gray-900/40 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden text-center sm:text-left">
            <h2 class="text-2xl font-bold text-white flex items-center gap-2 mb-6">📈 {{t('trendingParties')}}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div *ngFor="let party of trendingParties; let i = index" 
                   class="bg-gray-800 rounded-xl p-4 border border-white/5 relative overflow-hidden transition-all hover:scale-105"
                   [ngClass]="{'border-green-500/50 bg-green-900/20': i === 0}">
                <div class="absolute top-0 right-0 h-full w-1" [ngClass]="i === 0 ? 'bg-green-500' : 'bg-gray-600'"></div>
                <h3 class="text-xl font-bold text-white mb-1">#{{i+1}} {{party.name}}</h3>
                <p class="text-green-400 font-bold text-lg">{{party.votes}} {{t('votes')}}</p>
              </div>
            </div>
          </div>

          <div class="grid gap-8">
            <div *ngFor="let seat of results" class="bg-gray-900 rounded-2xl p-8 border-2 border-white/20">
              <div class="flex items-center gap-4 mb-6">
                <span class="text-5xl">{{ getSeatIcon(seat.seat_type) }}</span>
                <div>
                  <h2 class="text-3xl font-bold text-white">{{ getLocalizedSeatNameFull(seat) }}</h2>
                  <p class="text-gray-400">{{t('totalVotes')}} <span class="text-white font-bold">{{ seat.total_votes }}</span></p>
                </div>
              </div>

              <div class="space-y-4">
                <div *ngFor="let c of seat.sorted_results; let i = index"
                     class="bg-gray-800 rounded-lg p-4 relative overflow-hidden transition-all duration-[800ms] ease-out"
                     [ngClass]="{ 'ring-2 ring-green-500 bg-gray-700/50 shadow-2xl scale-[1.02] z-10': i === 0 && seat.total_votes > 0 }">
                  <div *ngIf="i === 0 && seat.total_votes > 0"
                       class="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-lg">
                    {{t('leading')}}
                  </div>
                  <div class="flex justify-between items-center mb-2">
                    <div>
                      <h3 class="text-xl font-bold text-white">{{ c.full_name }}</h3>
                      <p class="text-gray-400 text-sm">{{ c.party }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-green-400 flex items-center justify-end gap-2">
                        {{ c.votes }}
                        <span *ngIf="c.momentum > 0" class="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-bounce">
                          ▲ +{{c.momentum}}
                        </span>
                        <span *ngIf="c.momentum < 0" class="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                          ▼ {{c.momentum}}
                        </span>
                      </p>
                      <p class="text-gray-400 text-sm">{{ getPercentage(c.votes, seat.total_votes) | number:'1.1-1' }}%</p>
                    </div>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-3">
                    <div class="bg-gradient-to-r from-red-600 to-green-600 h-3 rounded-full transition-all duration-500"
                         [style.width.%]="getPercentage(c.votes, seat.total_votes)"></div>
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

  lang: 'en' | 'sw' = 'en';
  trendingParties: any[] = [];
  previousResults: { [candidateId: number]: number } = {};

  t(key: string): string { return I18N[this.lang][key] || key; }
  toggleLang() { this.lang = this.lang === 'en' ? 'sw' : 'en'; }

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadResults();
    this.refreshInterval = setInterval(() => this.loadResults(), 2000);
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval);
  }

  loadResults() {
    if (this.results.length === 0) {
      this.loading = true;
    }
    this.errorMsg = '';

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMsg = this.t('loginToView');
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.api.getResults({
      county: String(user.county),
      constituency: String(user.constituency),
      ward: String(user.ward)
    }).subscribe({
      next: (data) => {
        const partyAgg: { [partyName: string]: number } = {};

        data.forEach((seat: any) => {
          seat.total_votes = seat.results ? seat.results.reduce((sum: number, c: any) => sum + (c.votes || 0), 0) : 0;
          
          if (seat.results) {
            seat.results.forEach((c: any) => {
              if (c.party) {
                partyAgg[c.party] = (partyAgg[c.party] || 0) + (c.votes || 0);
              }
              c.momentum = (c.votes || 0) - (this.previousResults[c.candidate_id] || c.votes || 0);
              this.previousResults[c.candidate_id] = c.votes || 0;
            });
            seat.sorted_results = [...seat.results].sort((a: any, b: any) => b.votes - a.votes);
          } else {
            seat.sorted_results = [];
          }
        });
        
        this.trendingParties = Object.entries(partyAgg)
          .map(([name, votes]) => ({ name, votes }))
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 3);
        
        this.loading = false;
        this.results = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = this.t('failedToLoad');
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  getPercentage(votes: number, total: number): number {
    return total > 0 ? Math.round((votes / total) * 1000) / 10 : 0;
  }

  getSeatIcon(seatType: string): string {
    return SEAT_META[seatType]?.icon || '🏛️';
  }

  getSeatName(seatType: string): string {
    return this.t('seat_' + seatType);
  }

  getLocalizedSeatNameFull(seat: any): string {
    const role = this.getSeatName(seat.seat_type);
    const rawName = seat.seat_name || '';

    if (this.lang === 'en') {
      if (seat.seat_type === 'president' || rawName.includes('President')) {
        return 'President of the Republic of Kenya';
      }
      
      if (rawName.includes(' for ') && rawName.includes(' County')) {
        const region = rawName.substring(rawName.indexOf(' for ') + 5, rawName.indexOf(' County'));
        return `${role} for ${region} County`;
      }
      
      if (rawName.startsWith('MP - ')) {
        const region = rawName.replace('MP - ', '');
        return `${role} for ${region} Constituency`;
      }
      
      if (rawName.startsWith('MCA - ')) {
        const region = rawName.replace('MCA - ', '');
        return `${role} for ${region} Ward`;
      }
      
      return `${role} — ${rawName}`;
    }

    // Swahili formatting overrides
    if (seat.seat_type === 'president' || rawName.includes('President')) {
      return `${role} wa Jamhuri ya Kenya`;
    }

    if (rawName.includes(' for ') && rawName.includes(' County')) {
      const region = rawName.substring(rawName.indexOf(' for ') + 5, rawName.indexOf(' County'));
      return `${role} wa Kaunti ya ${region}`;
    }

    if (rawName.startsWith('MP - ')) {
      const region = rawName.replace('MP - ', '');
      return `${role} wa Eneo Bunge la ${region}`;
    }

    if (rawName.startsWith('MCA - ')) {
      const region = rawName.replace('MCA - ', '');
      return `${role} wa Wodi ya ${region}`;
    }

    return `${role} — ${rawName}`;
  }

  goTo(route: string) { this.router.navigate([route]); }
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}