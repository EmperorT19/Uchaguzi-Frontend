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
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">

      <!-- Loading overlay -->
      <div *ngIf="loading" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p class="text-white text-xl">{{ loadingMsg }}</p>
        </div>
      </div>

      <!-- Vote Success Modal -->
      <div *ngIf="showSuccess" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 max-w-md border-2 border-green-600 text-center">
          <div class="text-6xl mb-4">✅</div>
          <h3 class="text-3xl font-bold text-white mb-4">Vote Cast Successfully!</h3>
          <p class="text-gray-400 mb-6">Your vote for <span class="text-green-400 font-bold">{{ selectedCandidate?.name }}</span> has been recorded.</p>
          <button (click)="showSuccess = false; goBack()" class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-lg">
            Back to Dashboard
          </button>
        </div>
      </div>

      <!-- Confirm Vote Modal -->
      <div *ngIf="showConfirm" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 max-w-md border-2 border-yellow-600 text-center">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-2xl font-bold text-white mb-4">Confirm Your Vote</h3>
          <p class="text-gray-300 mb-2">You are voting for:</p>
          <p class="text-2xl font-bold text-white mb-1">{{ selectedCandidate?.name }}</p>
          <p class="text-gray-400 mb-6">{{ selectedCandidate?.party }}</p>
          <p class="text-red-400 text-sm mb-6">⚠️ This action cannot be undone.</p>
          <div class="flex gap-4">
            <button (click)="showConfirm = false" class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl">
              Cancel
            </button>
            <button (click)="confirmVote()" class="flex-1 py-3 bg-gradient-to-r from-red-600 to-green-600 text-white font-bold rounded-xl">
              Confirm Vote
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div class="container mx-auto px-8 py-4 flex justify-between items-center">
          <div class="flex gap-4">
            <button (click)="goTo('/dashboard')" class="px-8 py-3 rounded-xl font-semibold bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10">Dashboard</button>
            <button (click)="goTo('/voting')" class="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-black via-red-700 to-green-700 text-white shadow-lg border border-white/20">Vote</button>
            <button (click)="goTo('/results')" class="px-8 py-3 rounded-xl font-semibold bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10">Results</button>
          </div>
          <button (click)="logout()" class="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl">Logout</button>
        </div>
      </div>

      <div class="p-8 max-w-4xl mx-auto">
        <!-- Seat selector -->
        <div *ngIf="!activeSeat">
          <h1 class="text-4xl font-bold text-white mb-2">Cast Your Vote</h1>
          <p class="text-gray-400 mb-8">Select a seat to vote for</p>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let seat of seatList"
                 [ngClass]="{
                   'border-green-400/30 bg-gradient-to-br from-green-600/20 to-green-800/20': currentUser?.has_voted?.[seat.key],
                   'border-white/20 bg-gradient-to-br from-gray-800/90 to-black/90 hover:scale-105 cursor-pointer': !currentUser?.has_voted?.[seat.key]
                 }"
                 class="rounded-3xl p-8 border-2 transition-all backdrop-blur-sm shadow-xl">
              <div class="flex items-center justify-between mb-4">
                <span class="text-5xl">{{ seat.icon }}</span>
                <span class="text-3xl">{{ currentUser?.has_voted?.[seat.key] ? '✅' : '⏳' }}</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-1">{{ seat.name }}</h3>
              <p class="text-white/60 text-sm mb-4">{{ seat.level }} Level</p>
              <button *ngIf="!currentUser?.has_voted?.[seat.key]"
                      (click)="selectSeat(seat.key)"
                      class="w-full py-3 bg-gradient-to-r from-red-700 via-black to-green-700 text-white font-bold rounded-lg border border-white/30">
                Vote Now
              </button>
              <div *ngIf="currentUser?.has_voted?.[seat.key]" class="text-green-200 text-sm font-bold flex items-center gap-2">
                <span>✓</span> Voted Successfully
              </div>
            </div>
          </div>
        </div>

        <!-- Candidate selection -->
        <div *ngIf="activeSeat">
          <button (click)="activeSeat = null; candidates = []" class="mb-6 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            ← Back to Seats
          </button>

          <h1 class="text-4xl font-bold text-white mb-2">{{ seatMeta[activeSeat]?.name }}</h1>
          <p class="text-gray-400 mb-8">Select your candidate</p>

          <div *ngIf="candidates.length === 0 && !loading" class="text-gray-400 text-center py-12">
            No candidates found for this seat in your region.
          </div>

          <div class="grid gap-4">
            <div *ngFor="let c of candidates"
                 [ngClass]="{
                   'border-green-500 bg-green-900/20': selectedCandidate?.id === c.id,
                   'border-white/10 hover:border-white/30': selectedCandidate?.id !== c.id
                 }"
                 class="bg-gray-900/80 rounded-2xl p-6 border-2 cursor-pointer transition-all"
                 (click)="selectCandidate(c)">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                    {{ c.ballot_number || '#' }}
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-white">{{ c.name }}</h3>
                    <p class="text-gray-400">{{ c.party }}</p>
                  </div>
                </div>
                <div *ngIf="selectedCandidate?.id === c.id" class="text-green-400 text-2xl">✓</div>
              </div>
            </div>
          </div>

          <button *ngIf="selectedCandidate"
                  (click)="showConfirm = true"
                  class="mt-8 w-full py-5 bg-gradient-to-r from-red-700 via-black to-green-700 text-white font-bold text-xl rounded-lg hover:opacity-90">
            Proceed to Confirm Vote
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class Voting implements OnInit {
  currentUser: Voter | null = null;
  activeSeat: string | null = null;
  activeSeatId: number | null = null;
  candidates: any[] = [];
  selectedCandidate: any = null;
  loading = false;
  loadingMsg = 'Loading...';
  showConfirm = false;
  showSuccess = false;

  seatMeta = SEAT_META;
  seatList = Object.entries(SEAT_META).map(([key, val]) => ({ key, ...val }));

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const stored = sessionStorage.getItem('selectedSeat');
    if (stored) {
      sessionStorage.removeItem('selectedSeat');
      const seat = JSON.parse(stored);
      this.selectSeat(seat.seat_type);
    }
  }

  selectSeat(seatType: string) {
    console.log('USER:', this.currentUser);
    console.log('COUNTY:', this.currentUser?.county);
    console.log('CONSTITUENCY:', this.currentUser?.constituency);
    console.log('WARD:', this.currentUser?.ward);

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
        this.cdr.detectChanges();
        console.log('CANDIDATES RESPONSE:', data);
        const seat = data.find((s: any) => s.seat_type === seatType);
        this.activeSeatId = seat?.seat_id ?? null;
        this.candidates = seat ? seat.candidates.map((c: any) => ({
          id: c.id,
          name: c.full_name,
          party: c.party
        })) : [];
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

  confirmVote() {
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
      },
      error: (err) => {
        this.loading = false;
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
}