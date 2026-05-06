import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService, Voter } from '../../services/auth';
import { TranslationService } from '../../services/translation.service';
const SEATS = [
  { seat_type: 'president',  name: 'President',                   level: 'National',      icon: '🇰🇪' },
  { seat_type: 'governor',   name: 'Governor',                     level: 'County',        icon: '🏛️' },
  { seat_type: 'senator',    name: 'Senator',                      level: 'County',        icon: '⚖️'  },
  { seat_type: 'mp',         name: 'Member of Parliament',         level: 'Constituency',  icon: '📋' },
  { seat_type: 'woman_rep',  name: 'Woman Representative',         level: 'County',        icon: '👩' },
  { seat_type: 'mca',        name: 'Member of County Assembly',    level: 'Ward',          icon: '🏘️' }
];
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen transition-colors duration-300" style="background: var(--bg-primary); color: var(--text-primary)" [attr.data-lang]="translation.langTick">
      <!-- Navigation -->
      <div class="backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300" style="background: var(--header-bg); border-color: var(--border-color)">
        <div class="container mx-auto px-4 md:px-8 py-4">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
              <button (click)="goTo('/dashboard')" class="px-4 md:px-8 py-2 md:py-3 rounded-xl font-semibold shadow-lg transition text-sm md:text-base" style="background: var(--accent-color); color: white; border: 1px solid var(--border-color)">{{t('dashboard')}}</button>
              <button (click)="goTo('/voting')" class="px-4 md:px-8 py-2 md:py-3 rounded-xl font-semibold transition hover:opacity-80 text-sm md:text-base" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color)">{{t('vote')}}</button>
              <button (click)="goTo('/results')" class="px-4 md:px-8 py-2 md:py-3 rounded-xl font-semibold transition hover:opacity-80 text-sm md:text-base" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color)">{{t('results')}}</button>
              <button (click)="goTo('/analytics')" class="px-4 md:px-8 py-2 md:py-3 rounded-xl font-semibold transition hover:opacity-80 text-sm md:text-base" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color)">{{t('analytics')}}</button>
              <button (click)="goTo('/admin-portal')" class="px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition hover:opacity-80 text-sm md:text-base" style="background: transparent; color: #ef4444; border: 1px solid #ef4444">{{translation.t('adminPortal') || 'Admin Portal'}}</button>
            </div>
            <div class="flex gap-4 items-center w-full md:w-auto justify-between md:justify-end">
              <button (click)="translation.toggleLang()" class="px-4 py-2 font-bold rounded-lg transition hover:opacity-80" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color)">
                {{ translation.currentLang === 'en' ? 'SW' : 'EN' }}
              </button>
              <button (click)="logout()" class="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg">{{t('logout')}}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="min-h-screen p-8">
        <div class="max-w-7xl mx-auto">
          <!-- User Info -->
          <div class="mb-8 backdrop-blur-sm rounded-2xl p-8 border shadow-lg transition-colors duration-300" style="background: var(--bg-card); border-color: var(--border-color)">
            <p class="text-sm text-gray-400 mb-1 uppercase tracking-wider">{{t('welcomeBack')}}</p>
            <h1 class="text-4xl md:text-6xl font-bold uppercase break-words" style="color: var(--accent-color)">
              {{ currentUser?.full_name }}
            </h1>
            <div class="mt-4 space-y-2">
              <p style="color: var(--text-secondary)">{{t('voterCode')}}: <span class="font-mono font-bold" style="color: var(--accent-color)">{{ currentUser?.voter_code }}</span></p>
              <p style="color: var(--text-secondary)">{{t('county')}}: <span class="font-semibold" style="color: var(--text-primary)">{{ currentUser?.county }}</span></p>
              <p style="color: var(--text-secondary)">{{t('constituency')}}: <span class="font-semibold" style="color: var(--text-primary)">{{ currentUser?.constituency }}</span></p>
              <p style="color: var(--text-secondary)">{{t('ward')}}: <span class="font-semibold" style="color: var(--text-primary)">{{ currentUser?.ward }}</span></p>
            </div>
          </div>
          <!-- Progress Stats -->
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="backdrop-blur-sm rounded-2xl p-6 border shadow-sm transition-colors duration-300" style="background: var(--bg-card); border-color: var(--border-color)">
              <p class="text-sm uppercase tracking-wider mb-2" style="color: var(--accent-color)">{{t('seatsVoted')}}</p>
              <div class="text-4xl font-bold" style="color: var(--text-primary)">{{ votedCount }} / {{ seats.length }}</div>
            </div>
            <div class="backdrop-blur-sm rounded-2xl p-6 border shadow-sm transition-colors duration-300" style="background: var(--bg-card); border-color: var(--border-color)">
              <p class="text-blue-400 text-sm uppercase tracking-wider mb-2">{{t('progress')}}</p>
              <div class="text-4xl font-bold" style="color: var(--text-primary)">{{ votingProgress }}%</div>
              <div class="mt-3 w-full rounded-full h-2" style="background: var(--border-color)">
                <div class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all" [style.width.%]="votingProgress"></div>
              </div>
            </div>
            <div class="backdrop-blur-sm rounded-2xl p-6 border shadow-sm transition-colors duration-300" style="background: var(--bg-card); border-color: var(--border-color)">
              <p class="text-purple-400 text-sm uppercase tracking-wider mb-2">{{t('pending')}}</p>
              <div class="text-4xl font-bold" style="color: var(--text-primary)">{{ seats.length - votedCount }}</div>
            </div>
          </div>
          <!-- Voting Cards -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold flex items-center gap-2" style="color: var(--text-primary)">
              <span>🗳️</span> {{t('yourVotingStatus')}}
            </h2>
            <button (click)="refreshVoterStatus()" 
                    class="p-2 rounded-lg transition hover:bg-white/10 flex items-center gap-2 text-xs font-bold"
                    [class.animate-spin]="syncing"
                    style="color: var(--accent-color); border: 1px solid var(--border-color)">
              <span *ngIf="!syncing">🔄</span>
              <span *ngIf="syncing">⌛</span>
              {{ syncing ? 'SYNCING...' : 'REFRESH STATUS' }}
            </button>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let seat of seats"
                 class="rounded-3xl p-8 border-2 transition-all hover:scale-105 backdrop-blur-sm shadow-xl"
                 [style.background]="hasVoted(seat.seat_type) ? 'var(--bg-primary)' : 'var(--bg-card)'"
                 [style.borderColor]="hasVoted(seat.seat_type) ? 'var(--accent-color)' : 'var(--border-color)'">
              <div class="flex items-center justify-between mb-4">
                <span class="text-5xl">{{ seat.icon }}</span>
                <span class="text-4xl">{{ hasVoted(seat.seat_type) ? '✅' : '⏳' }}</span>
              </div>
              <h3 class="text-2xl font-bold mb-2" style="color: var(--text-primary)">{{ t('seat_' + seat.seat_type) }}</h3>
              <p class="text-sm mb-4" style="color: var(--text-secondary)">{{ seat.level }} {{t('level')}}</p>
              <button *ngIf="!hasVoted(seat.seat_type)"
                      (click)="startVoting(seat)"
                      class="w-full py-3 text-white font-bold rounded-lg shadow-xl transition-all"
                      style="background: var(--accent-color)">
                {{t('voteNow')}}
              </button>
              <div *ngIf="hasVoted(seat.seat_type)" class="text-sm font-bold flex items-center gap-2" style="color: var(--accent-color)">
                <span>✓</span> {{t('votedSuccess')}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  /**
   * Voter Hub: 
   * Central dashboard where users track their voting progress across 
   * National, County, and Ward levels.
   */
  currentUser: Voter | null = null;
  seats = SEATS;
  private interval: any;

  t(key: string): string { return this.translation.t(key); }

  get votedCount(): number {
    // Calculates how many unique seats the voter has completed
    if (!this.currentUser?.has_voted) return 0;
    return Object.values(this.currentUser.has_voted).filter(Boolean).length;
  }

  get votingProgress(): number {
    return Math.round((this.votedCount / this.seats.length) * 100);
  }

  private langChangedHandler = () => this.cdr.detectChanges();

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translation: TranslationService
  ) {}

  ngOnInit() {
    window.addEventListener('langChanged', this.langChangedHandler);
    
    //keep the UI in sync with AuthService state
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user && this.router.url === '/dashboard') {
        this.router.navigate(['/login']);
      }
    });

    if (this.currentUser) {
      this.refreshVoterStatus();
    }
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
    window.removeEventListener('langChanged', this.langChangedHandler);
  }

  syncing = false;
  refreshVoterStatus() {
    if (!this.currentUser || this.syncing) return;
    this.syncing = true;
    this.api.getVoterStatus(this.currentUser.id).subscribe({
      next: (data: { has_voted: string[]; }) => {
        const backendHasVoted: { [key: string]: boolean } = {};
        SEATS.forEach(s => backendHasVoted[s.seat_type] = false);
        data.has_voted.forEach((seat: string) => backendHasVoted[seat] = true);
        
        // Merge: Keep local 'true' values even if backend says 'false' (prevents flicker)
        const currentLocal = this.currentUser?.has_voted || {};
        const merged: { [key: string]: boolean } = {};
        SEATS.forEach(s => {
          merged[s.seat_type] = backendHasVoted[s.seat_type] || currentLocal[s.seat_type];
        });

        const updatedUser = { ...this.currentUser!, has_voted: merged };
        this.authService.setCurrentUser(updatedUser);
        this.syncing = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Could not refresh voter status', err);
        this.syncing = false;
        this.cdr.detectChanges();
      }
    });
  }

  hasVoted(seatType: string): boolean {
    return !!this.currentUser?.has_voted?.[seatType];
  }

  startVoting(seat: any) {
    // Context Handoff: Stores the selected seat in sessionStorage before routing to Ballot
    sessionStorage.setItem('selectedSeat', JSON.stringify(seat));
    this.router.navigate(['/voting']);
  }

  goTo(route: string) { this.router.navigate([route]); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
