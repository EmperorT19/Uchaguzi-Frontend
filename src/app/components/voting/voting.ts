// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-voting',
// //   imports: [],
// //   templateUrl: './voting.html',
// //   styleUrl: './voting.css',
// // })
// // export class Voting {

// // }

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// interface County {
//   voters: number;
//   constituencies: { [key: string]: string[] };
// }

// interface User {
//   fullName: string;
//   idNumber: string;
//   county: string;
//   constituency: string;
//   ward: string;
//   phone: string;
//   voterCode: string;
//   hasVoted: {
//     presidential: boolean;
//     gubernatorial: boolean;
//     senatorial: boolean;
//     womenRep: boolean;
//     mp: boolean;
//     mca: boolean;
//   };
//   registeredAt: string;
// }

// interface Candidate {
//   name: string;
//   party: string;
//   num: number;
// }

// @Component({
//   selector: 'app-voting',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './voting.html',
//   styleUrl: './voting.css'
// })
// export class Voting implements OnInit {
//   page = 'landing';
//   modal: string | null = null;

//   form = {
//     fullName: '',
//     idNumber: '',
//     county: '',
//     constituency: '',
//     ward: '',
//     phone: '+254'
//   };

//   loginForm = {
//     voterCode: '',
//     idNumber: ''
//   };

//   errors: any = {};
//   currentUser: User | null = null;
//   votingFor = 'presidential';
//   selectedCandidates: any = {};
//   votes: any = {};
//   registeredUsers: { [key: string]: User } = {};

//   COUNTIES_DATA: { [key: string]: County } = {
//     Nairobi: {
//       voters: 2450000,
//       constituencies: {
//         Westlands: ['Kitisuru', 'Parklands/Highridge', 'Karura', 'Kangemi', 'Mountain View'],
//         Langata: ['Karen', 'Nairobi West', 'Mugumo-ini', 'South C', 'Nyayo Highrise']
//       }
//     },
//     Mombasa: {
//       voters: 650000,
//       constituencies: {
//         Changamwe: ['Port Reitz', 'Kipevu', 'Airport', 'Changamwe', 'Chaani'],
//         Mvita: ['Mji Wa Kale/Makadara', 'Tudor', 'Tononoka', 'Shimanzi/Ganjoni', 'Majengo']
//       }
//     }
//   };

//   seats = [
//     { id: 'presidential', name: 'President', level: 'National', icon: '🇰🇪' },
//     { id: 'gubernatorial', name: 'Governor', level: 'County', icon: '🏛️' },
//     { id: 'senatorial', name: 'Senator', level: 'County', icon: '⚖️' },
//     { id: 'womenRep', name: 'Women Representative', level: 'County', icon: '👩' },
//     { id: 'mp', name: 'Member of Parliament', level: 'Constituency', icon: '📜' },
//     { id: 'mca', name: 'Member of County Assembly', level: 'Ward', icon: '🏘️' }
//   ];

//   candidates: any = {
//     presidential: [
//       { name: 'Dr. Jane Wanjiku Mwangi', party: 'National Unity Alliance', num: 1 },
//       { name: 'Hon. David Kipchoge Korir', party: 'Progressive Democratic Party', num: 2 },
//       { name: 'Prof. Grace Akinyi Otieno', party: "People's Voice Movement", num: 3 }
//     ],
//     gubernatorial: [
//       { name: 'John Kamau', party: 'Party A', num: 1 },
//       { name: 'Mary Njeri', party: 'Party B', num: 2 }
//     ],
//     senatorial: [
//       { name: 'Peter Ochieng', party: 'Party C', num: 1 },
//       { name: 'Sarah Wambui', party: 'Party D', num: 2 }
//     ],
//     womenRep: [
//       { name: 'Faith Muthoni', party: 'Party E', num: 1 },
//       { name: 'Lucy Akinyi', party: 'Party F', num: 2 }
//     ],
//     mp: [
//       { name: 'James Kiplagat', party: 'Party G', num: 1 },
//       { name: 'Rose Chebet', party: 'Party H', num: 2 }
//     ],
//     mca: [
//       { name: 'David Mutua', party: 'Party I', num: 1 },
//       { name: 'Jane Wanjiru', party: 'Party J', num: 2 }
//     ]
//   };

//   ngOnInit() {
//     const savedUsers = localStorage.getItem('voting_users');
//     const savedVotes = localStorage.getItem('voting_votes');

//     if (savedUsers) this.registeredUsers = JSON.parse(savedUsers);
//     if (savedVotes) this.votes = JSON.parse(savedVotes);
//   }

//   getCounties() {
//     return Object.keys(this.COUNTIES_DATA);
//   }

//   getConstituencies() {
//     if (!this.form.county) return [];
//     return Object.keys(this.COUNTIES_DATA[this.form.county].constituencies);
//   }

//   getWards() {
//     if (!this.form.constituency) return [];
//     return this.COUNTIES_DATA[this.form.county].constituencies[this.form.constituency];
//   }

//   onCountyChange() {
//     this.form.constituency = '';
//     this.form.ward = '';
//   }

//   onConstituencyChange() {
//     this.form.ward = '';
//   }

//   handleInput(field: string, event: any) {
//     const value = event.target.value;

//     if (field === 'fullName') {
//       this.form.fullName = value.replace(/[^A-Za-z\s]/g, '');
//       this.errors.fullName = '';
//     }

//     if (field === 'idNumber') {
//       this.form.idNumber = value.replace(/\D/g, '').slice(0, 8);
//       this.errors.idNumber = '';
//     }

//     if (field === 'phone') {
//       this.form.phone = '+254' + value.slice(4).replace(/\D/g, '').slice(0, 9);
//       this.errors.phone = '';
//     }
//   }

//   filterIdNumber(event: any) {
//     this.loginForm.idNumber = event.target.value.replace(/\D/g, '').slice(0, 8);
//   }

//   validate() {
//     this.errors = {};

//     if (!this.form.fullName.trim()) this.errors.fullName = 'Required';
//     if (!this.form.idNumber.trim()) this.errors.idNumber = 'Required';
//     if (!this.form.county) this.errors.county = 'Required';
//     if (!this.form.constituency) this.errors.constituency = 'Required';
//     if (!this.form.ward) this.errors.ward = 'Required';
//     if (!/^\+254\d{9}$/.test(this.form.phone)) this.errors.phone = 'Invalid format';

//     return Object.keys(this.errors).length === 0;
//   }

//   register() {
//     if (!this.validate()) return;

//     if (this.registeredUsers[this.form.idNumber]) {
//       this.modal = 'already-registered';
//       return;
//     }

//     const voterCode =
//       'KV' +
//       Date.now().toString(36).toUpperCase() +
//       Math.random().toString(36).substring(2, 5).toUpperCase();

//     const newUser: User = {
//       ...this.form,
//       voterCode,
//       hasVoted: {
//         presidential: false,
//         gubernatorial: false,
//         senatorial: false,
//         womenRep: false,
//         mp: false,
//         mca: false
//       },
//       registeredAt: new Date().toISOString()
//     };

//     this.registeredUsers[this.form.idNumber] = newUser;
//     this.currentUser = newUser;

//     localStorage.setItem('voting_users', JSON.stringify(this.registeredUsers));
//     this.modal = 'show-voter-code';
//   }

//   login() {
//     const user = this.registeredUsers[this.loginForm.idNumber];
//     if (user && user.voterCode === this.loginForm.voterCode) {
//       this.currentUser = user;
//       this.page = 'dashboard';
//       this.loginForm = { voterCode: '', idNumber: '' };
//     } else {
//       this.modal = 'not-registered-login';
//     }
//   }

//   logout() {
//     this.currentUser = null;
//     this.page = 'landing';
//   }

//   startVoting(seatId: string) {
//     this.votingFor = seatId;
//     this.page = 'voting';
//   }

//   getCandidates(seatId: string): Candidate[] {
//     return this.candidates[seatId] || [];
//   }

//   selectCandidate(candidate: Candidate) {
//     this.selectedCandidates[this.votingFor] = candidate;
//   }

//   submitVote() {
//     if (!this.selectedCandidates[this.votingFor]) return;
//     this.modal = 'vote-confirm';
//   }

//   confirmVote() {
//     const key = `${this.votingFor}_${this.selectedCandidates[this.votingFor].name}`;
//     this.votes[key] = (this.votes[key] || 0) + 1;

//     if (this.currentUser) {
//       this.currentUser.hasVoted[this.votingFor as keyof User['hasVoted']] = true;
//       this.registeredUsers[this.currentUser.idNumber] = this.currentUser;
//       localStorage.setItem('voting_users', JSON.stringify(this.registeredUsers));
//       localStorage.setItem('voting_votes', JSON.stringify(this.votes));
//     }

//     this.selectedCandidates[this.votingFor] = null;
//     this.modal = 'vote-success';
//   }

//   getSeatName(seatId: string) {
//     return this.seats.find(s => s.id === seatId)?.name || '';
//   }

//   getResults(seatId: string) {
//     return this.candidates[seatId].map((c: Candidate) => ({
//       ...c,
//       votes: this.votes[`${seatId}_${c.name}`] || 0
//     }));
//   }

//   getTotalVotes(seatId: string) {
//     return this.getResults(seatId).reduce((sum: number, c: any) => sum + c.votes, 0);
//   }

//   getPercentage(votes: number, total: number) {
//     return total ? Math.round((votes / total) * 100) : 0;
//   }

//   closeModal() { this.modal = null; }
//   goToDashboard() { this.modal = null; this.page = 'dashboard'; }
//   goToRegistration() { this.modal = null; this.page = 'registration'; }
//   goToLanding() { this.modal = null; this.page = 'landing'; }
// }
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService, Voter } from '../../services/auth';

const SEAT_META: { [key: string]: { name: string; icon: string; level: string } } = {
  president:   { name: 'President',                   icon: '🇰🇪', level: 'National' },
  governor:    { name: 'Governor',                     icon: '🏛️', level: 'County' },
  senator:     { name: 'Senator',                      icon: '⚖️',  level: 'County' },
  mp:          { name: 'Member of Parliament',         icon: '📋', level: 'Constituency' },
  woman_rep:   { name: 'Woman Representative',         icon: '👩', level: 'County' },
  mca:         { name: 'Member of County Assembly',    icon: '🏘️', level: 'Ward' }
};

import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen transition-colors duration-300" style="background: var(--bg-primary); color: var(--text-primary)">

      <!-- Loading Skeleton overlay -->
      <div *ngIf="loading" class="fixed inset-0 bg-black/90 backdrop-blur z-50 p-8 overflow-y-auto pt-24 text-center">
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-12">
            <div class="h-12 bg-gray-800/80 w-1/3 rounded-xl animate-pulse"></div>
            <div class="h-12 w-12 rounded-full border-4 border-t-green-500 border-gray-800 animate-spin"></div>
          </div>
          <div class="grid gap-6">
            <div class="h-32 bg-gray-800/50 rounded-3xl border border-white/5 animate-pulse"></div>
            <div class="h-32 bg-gray-800/50 rounded-3xl border border-white/5 animate-pulse"></div>
            <div class="h-32 bg-gray-800/50 rounded-3xl border border-white/5 animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Vote Success Modal -->
      <div *ngIf="showSuccess" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 max-w-md border-2 border-green-600 text-center">
          <div class="text-6xl mb-4">✅</div>
          <h3 class="text-3xl font-bold text-white mb-4">{{t('votedSuccess')}}</h3>
          <p class="text-gray-400 mb-6">{{t('selectCandidate')}} <span class="text-green-400 font-bold">{{ selectedCandidate?.name }}</span></p>
          <button (click)="showSuccess = false; goBack()" class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-lg">
            {{t('backToSeats')}}
          </button>
        </div>
      </div>

      <!-- Confirm Vote Modal -->
      <div *ngIf="showConfirm" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 max-w-md border-2 border-yellow-600 text-center">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-2xl font-bold text-white mb-4">{{t('proceedConfirm')}}</h3>
          <p class="text-gray-300 mb-2">{{t('selectCandidate')}}:</p>
          <p class="text-2xl font-bold text-white mb-1">{{ selectedCandidate?.name }}</p>
          <p class="text-gray-400 mb-6">{{ selectedCandidate?.party }}</p>
          <p class="text-red-400 text-sm mb-6">⚠️ {{t('voteWarning')}}</p>
          <div class="flex gap-4">
            <button (click)="showConfirm = false" class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl">
              {{t('cancelVote')}}
            </button>
            <button (click)="confirmVote()" class="flex-1 py-3 bg-gradient-to-r from-red-600 to-green-600 text-white font-bold rounded-xl">
              {{t('confirmVote')}}
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300" style="background: var(--header-bg); border-color: var(--border-color)">
        <div class="container mx-auto px-8 py-4 flex justify-between items-center">
          <div class="flex gap-4">
            <button (click)="goTo('/dashboard')" class="px-8 py-3 rounded-xl font-semibold transition hover:opacity-80" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color)">{{t('dashboard')}}</button>
            <button (click)="goTo('/voting')" class="px-8 py-3 rounded-xl font-semibold shadow-lg transition" style="background: var(--accent-color); color: white; border: 1px solid var(--border-color)">{{t('vote')}}</button>
            <button (click)="goTo('/results')" class="px-8 py-3 rounded-xl font-semibold transition hover:opacity-80" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color)">{{t('results')}}</button>
            <button (click)="goTo('/analytics')" class="px-8 py-3 rounded-xl font-semibold transition hover:opacity-80" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color)">{{t('analytics')}}</button>
            <button (click)="goTo('/admin-portal')" class="px-8 py-3 rounded-xl font-bold transition hover:opacity-80" style="background: transparent; color: #ef4444; border: 1px solid #ef4444">{{translation.t('adminPortal') || 'Admin Portal'}}</button>
          </div>
          <div class="flex gap-4 items-center">
            <button (click)="translation.toggleLang()" class="px-4 py-2 font-bold rounded-lg transition" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color)">
              {{ translation.currentLang === 'en' ? 'SW' : 'EN' }}
            </button>
            <button (click)="logout()" class="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105">{{t('logout')}}</button>
          </div>
        </div>
      </div>

      <div class="p-8 max-w-4xl mx-auto">
        <!-- Seat selector -->
        <div *ngIf="!activeSeat">
          <!-- Voter Progress Tracker -->
          <div class="mb-10 p-8 rounded-3xl border shadow-2xl relative overflow-hidden text-center sm:text-left transition-colors" style="background: var(--bg-card); border-color: var(--border-color)">
            <div class="flex flex-col sm:flex-row justify-between items-center mb-4 relative z-10">
              <h2 class="text-2xl font-bold flex items-center gap-2" style="color: var(--text-primary)">🗳️ {{t('ballotJourney')}}</h2>
              <span class="font-black text-xl px-4 py-1 rounded-full border shadow-sm" style="color: var(--accent-color); border-color: var(--accent-color); background: var(--bg-primary)">
                {{votedCount}}/{{seatList.length}} {{t('completed')}}
              </span>
            </div>
            <div class="w-full rounded-full h-5 overflow-hidden shadow-inner relative z-10 border" style="background: var(--bg-primary); border-color: var(--border-color)">
              <div class="h-full rounded-full transition-all duration-1000 ease-out shadow-lg" 
                   style="background: var(--accent-color)"
                   [style.width.%]="(votedCount / seatList.length) * 100"></div>
            </div>
            <p *ngIf="votedCount === seatList.length" class="mt-4 text-center font-black text-2xl tracking-widest animate-bounce relative z-10" style="color: var(--accent-color)">🎉 {{t('allDone')}}</p>
          </div>

          <h1 class="text-4xl font-bold mb-2" style="color: var(--text-primary)">{{t('castVote')}}</h1>
          <p class="mb-8" style="color: var(--text-secondary)">{{t('selectSeat')}}</p>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let seat of seatList"
                 [ngClass]="{
                   'hover:scale-105 cursor-pointer': !currentUser?.has_voted?.[seat.key]
                 }"
                 class="rounded-3xl p-8 border-2 transition-all backdrop-blur-sm shadow-xl" 
                 [style.background]="'var(--bg-card)'" 
                 [style.border-color]="currentUser?.has_voted?.[seat.key] ? 'var(--accent-color)' : 'var(--border-color)'"
                 [style.opacity]="currentUser?.has_voted?.[seat.key] ? '0.7' : '1'">
              <div class="flex items-center justify-between mb-4">
                <span class="text-5xl">{{ seat.icon }}</span>
                <span class="text-3xl">{{ currentUser?.has_voted?.[seat.key] ? '✅' : '⏳' }}</span>
              </div>
              <h3 class="text-xl font-bold mb-1" style="color: var(--text-primary)">{{ t('seat_' + seat.key) }}</h3>
              <p class="text-sm mb-4" style="color: var(--text-secondary)">{{ seat.level }} Level</p>
              <button *ngIf="!currentUser?.has_voted?.[seat.key]"
                      (click)="selectSeat(seat.key)"
                      class="w-full py-3 text-white font-bold rounded-lg transition-transform hover:scale-105 shadow-lg"
                      style="background: var(--accent-color)">
                {{t('voteNow')}}
              </button>
              <div *ngIf="currentUser?.has_voted?.[seat.key]" class="font-bold flex items-center gap-2" style="color: var(--accent-color)">
                <span>✓</span> {{t('votedSuccess')}}
              </div>
            </div>
          </div>
        </div>

        <!-- Candidate selection -->
        <div *ngIf="activeSeat">
          <button (click)="activeSeat = null; candidates = []" class="mb-6 px-6 py-3 rounded-lg border transition-colors" style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color)">
            ← {{t('backToSeats')}}
          </button>

          <h1 class="text-4xl font-bold mb-2" style="color: var(--text-primary)">{{ t('seat_' + activeSeat) }}</h1>
          <p class="mb-8" style="color: var(--text-secondary)">{{t('selectCandidate')}}</p>

          <div *ngIf="candidates.length === 0 && !loading" class="text-gray-400 text-center py-12">
            {{t('noCandidates')}}
          </div>

          <div *ngIf="candidates.length > 0" class="mb-6">
            <input [(ngModel)]="searchTerm" type="text" [placeholder]="t('search')"
                   class="w-full px-5 py-4 rounded-xl border-2 focus:outline-none transition-colors shadow-lg"
                   style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color)" />
          </div>

          <div class="grid gap-4">
            <div *ngFor="let c of filteredCandidates"
                 [ngClass]="{
                   'border-green-500': selectedCandidate?.id === c.id,
                   'hover:opacity-90': selectedCandidate?.id !== c.id
                 }"
                 class="rounded-2xl p-6 border-2 cursor-pointer transition-all"
                 [style.background]="selectedCandidate?.id === c.id ? 'var(--bg-primary)' : 'var(--bg-card)'"
                 [style.borderColor]="selectedCandidate?.id === c.id ? 'var(--accent-color)' : 'var(--border-color)'"
                 (click)="selectCandidate(c)">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                    {{ c.ballot_number || '#' }}
                  </div>
                  <div>
                    <h3 class="text-xl font-bold" style="color: var(--text-primary)">{{ c.name }}</h3>
                    <p style="color: var(--text-secondary)">{{ c.party }}</p>
                  </div>
                </div>
                <div *ngIf="selectedCandidate?.id === c.id" style="color: var(--accent-color)" class="text-2xl">✓</div>
              </div>

              <!-- AI Summarize Button & Display block -->
              <div class="mt-4 pt-4 border-t" [style.borderColor]="'var(--border-color)'" (click)="$event.stopPropagation()">
                <button *ngIf="!c.ai_summary && !loadingSummaries[c.id]" (click)="summarizeCandidate(c.id)" class="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-2">
                  ✨ AI: Summarize Candidate
                </button>
                <div *ngIf="loadingSummaries[c.id]" class="flex items-center gap-2 text-sm" style="color: var(--text-secondary)">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div> Asking AI...
                </div>
                <div *ngIf="c.ai_summary" class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-sm" style="color: var(--text-secondary)">
                  <span class="font-bold text-blue-400 block mb-1">✨ AI Summary</span>
                  {{ c.ai_summary }}
                </div>
              </div>

            </div>
          </div>

          <button *ngIf="selectedCandidate"
                  (click)="showConfirm = true"
                  class="mt-8 w-full py-5 bg-gradient-to-r from-red-700 via-black to-green-700 text-white font-bold text-xl rounded-lg hover:opacity-90">
            {{t('proceedConfirm')}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class Voting implements OnInit, OnDestroy {
  /**
   * Ballot Interface: 
   * Manages candidate selection, AI-powered summaries, and secure vote submission.
   * Filters candidates based on the logged-in voter's specific regional data.
   */
  currentUser: Voter | null = null;
  activeSeat: string | null = null;
  activeSeatId: number | null = null;
  candidates: any[] = [];
  selectedCandidate: any = null;
  loading = false;
  loadingMsg = 'Loading...';
  showConfirm = false;
  showSuccess = false;

  loadingSummaries: { [key: number]: boolean } = {};
  searchTerm: string = '';
  t(key: string): string { return this.translation.t(key); }

  get votedCount(): number {
    if (!this.currentUser || !this.currentUser.has_voted) return 0;
    return Object.values(this.currentUser.has_voted).filter(v => v === true).length;
  }

  get filteredCandidates() {
    // Live Search: Allows voters to quickly find candidates by name or party
    if (!this.searchTerm) return this.candidates;
    const term = this.searchTerm.toLowerCase();
    return this.candidates.filter(c => 
      c.name.toLowerCase().includes(term) || 
      (c.party && c.party.toLowerCase().includes(term))
    );
  }

  seatMeta = SEAT_META;
  seatList = Object.entries(SEAT_META).map(([key, val]) => ({ key, ...val }));

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
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Direct Entry: If a user clicked 'Vote' on a specific seat in the dashboard
    const stored = sessionStorage.getItem('selectedSeat');
    if (stored) {
      sessionStorage.removeItem('selectedSeat');
      const seat = JSON.parse(stored);
      this.selectSeat(seat.seat_type);
    }
  }

  selectSeat(seatType: string) {
    /**
     * Regional Candidate Fetch:
     * Critical Sync point. Sends user's County/Constituency/Ward IDs to the backend
     * to fetch only the candidates relevant to their physical location.
     */
    this.activeSeat = seatType;
    this.activeSeatId = null;
    this.selectedCandidate = null;
    this.candidates = [];
    this.loading = true;
    this.loadingMsg = 'Loading candidates...';

    const user = this.currentUser!;
    this.api.getCandidates({
      county: String(user.county),
      constituency: String(user.constituency),
      ward: String(user.ward),
      seat_type: seatType
    }).subscribe({
      next: (data) => {
        this.loading = false;
        const seat = data.find((s: any) => s.seat_type === seatType && s.candidates.length > 0);
        this.activeSeatId = seat?.seat_id ?? null;
        this.candidates = seat ? seat.candidates.map((c: any) => ({
          id: c.id,
          name: c.full_name,
          party: c.party
        })) : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load candidates', err);
      }
    });
  }

  selectCandidate(candidate: any) {
    this.selectedCandidate = candidate;
  }

  summarizeCandidate(id: number) {
    // AI Integration: Requests a dynamic, 2-sentence summary of the candidate's platform
    this.loadingSummaries[id] = true;
    this.api.summarizeCandidate(id).subscribe({
      next: (res) => {
        const candidate = this.candidates.find(c => c.id === id);
        if(candidate) candidate.ai_summary = res.summary;
        this.loadingSummaries[id] = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingSummaries[id] = false;
        alert('Failed to generate AI summary.');
        this.cdr.detectChanges();
      }
    });
  }

  confirmVote() {
    /**
     * Secure Submission: 
     * Transmits the ballot to the backend for audit trail recording.
     * Prevents double-voting via backend constraints and frontend state updates.
     */
    if (!this.selectedCandidate || !this.currentUser || !this.activeSeat || !this.activeSeatId) return;

    this.showConfirm = false;
    this.loading = true;
    this.loadingMsg = 'Casting vote...';

    this.api.castVote({
      voter_id: this.currentUser.id,
      seat_id: this.activeSeatId,
      candidate_id: this.selectedCandidate.id
    }).subscribe({
      next: () => {
        this.loading = false;
        this.authService.updateVotedStatus(this.activeSeat!);
        this.currentUser = this.authService.getCurrentUser();
        this.activeSeat = null;
        this.activeSeatId = null;
        this.candidates = [];
        this.showSuccess = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        alert(err.error?.message || err.error?.detail || 'Failed to cast vote. Please try again.');
      }
    });
  }

  goBack() { this.router.navigate(['/dashboard']); }
  goTo(route: string) { this.router.navigate([route]); }
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  ngOnDestroy() {
    window.removeEventListener('langChanged', this.langChangedHandler);
  }
}