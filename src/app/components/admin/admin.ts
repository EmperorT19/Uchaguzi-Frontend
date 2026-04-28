import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-black">
      
      <!-- Login View -->
      <div *ngIf="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541872703864-f97167ea85fa?q=80&w=2070')] bg-cover bg-center">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div class="relative z-10 w-full max-w-md p-8 bg-gray-900 border border-red-900/50 rounded-2xl shadow-2xl shadow-red-900/20">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 mb-2">IEBC</h1>
            <p class="text-gray-400 font-bold tracking-widest text-sm">SECURE COMMAND CENTER</p>
          </div>
          
          <div *ngIf="errorMsg" class="bg-red-900/40 text-red-400 p-4 rounded-lg mb-6 border border-red-500/50 text-center">
            {{ errorMsg }}
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-gray-400 mb-2 text-sm font-bold uppercase">Root Access Key</label>
              <input type="password" [(ngModel)]="adminKey" (keyup.enter)="login()"
                     class="w-full bg-black border-2 border-gray-800 rounded-xl p-4 text-white font-mono focus:border-red-600 focus:outline-none transition-colors"
                     placeholder="••••••••">
            </div>
            <button (click)="login()" [disabled]="loading"
                    class="w-full py-4 bg-gradient-to-r from-red-700 hover:from-red-600 to-red-900 text-white font-bold rounded-xl uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50">
              {{ loading ? 'Authenticating...' : 'Enter System' }}
            </button>
            <button (click)="goTo('/')" class="w-full py-2 text-gray-500 hover:text-white text-sm mt-4 transition-colors">
              Return to Public Portal
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard View -->
      <div *ngIf="isAuthenticated" class="min-h-screen bg-gray-950 font-mono">
        <div class="bg-red-900 text-white px-8 py-4 flex justify-between items-center border-b-4 border-red-600 shadow-lg">
          <div class="flex items-center gap-4">
            <span class="text-2xl animate-pulse">🔴</span>
            <div>
              <h1 class="font-bold text-xl tracking-widest">{{ translation.t('electionCommandCenter') || 'ELECTION COMMAND CENTER' }}</h1>
              <p class="text-xs text-red-200">{{ translation.t('liveSystemObservatory') || 'LIVE SYSTEM OBSERVATORY' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button (click)="translation.toggleLang()" class="px-4 py-2 bg-black/50 hover:bg-black text-white border border-red-500/30 rounded-lg font-bold transition-colors">
              {{ translation.currentLang === 'en' ? 'SW' : 'EN' }}
            </button>
            <button (click)="goToDashboard()" class="px-6 py-2 bg-black/50 hover:bg-black text-white border border-red-500/30 rounded-lg transition-colors">{{ translation.t('goToDashboardUpper') || 'GO TO DASHBOARD' }}</button>
          </div>
        </div>

        <div class="p-8 max-w-7xl mx-auto grid gap-8">
          
          <!-- Control Panel -->
          <div class="bg-black border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
             <div class="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
             <div class="flex justify-between items-center">
                 <div>
                   <h2 class="text-2xl font-bold text-white mb-2">{{ translation.t('electionStatus') || 'ELECTION STATUS' }}: <span [ngClass]="{'text-green-500': stats?.is_active, 'text-red-500 animate-pulse': stats?.is_active === false}">{{stats === null ? 'LOADING...' : (stats?.is_active ? (translation.t('activeUpper') || 'ACTIVE') : 'HALTED')}}</span></h2>
                   <p class="text-gray-500 min-h-[40px]">{{stats?.is_active ? translation.t('systemAccepting') : 'blocking all incoming vote attempts.'}}</p>
                </div>
                <div class="flex flex-col items-end gap-3">
                   <!-- Master Switch -->
                   <button (click)="toggleHalt()" [ngClass]="{'text-red-500 border-red-600 hover:bg-red-600 hover:text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]': stats?.is_active, 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border-red-500 hover:bg-red-700': stats?.is_active === false}" class="px-8 py-3 bg-red-600/20 border rounded-xl font-bold text-lg w-64 transition-all">
                     {{stats?.is_active ? (translation.t('haltElection') || 'HALT ELECTION') : 'RESUME ELECTION'}}
                   </button>
                   <!-- Wipe Switch -->
                   <button (click)="restartElection()" class="px-8 py-2 border border-orange-600/50 text-orange-500 hover:bg-orange-600 hover:text-white rounded-xl font-bold text-xs w-64 transition-all cursor-pointer">
                     {{ translation.t('wipeDatabase') || 'WIPE DATABASE & RESTART' }}
                   </button>
                </div>
             </div>
          </div>

          <!-- Live Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-black border border-gray-800 rounded-2xl p-6">
              <h3 class="text-gray-500 font-bold mb-2">{{ translation.t('totalRegisteredUpper') || 'TOTAL REGISTERED' }}</h3>
              <p class="text-5xl font-bold text-white">{{stats?.total_voters | number}}</p>
            </div>
            <div class="bg-black border border-gray-800 rounded-2xl p-6">
              <h3 class="text-gray-500 font-bold mb-2">{{ translation.t('votesCastUpper') || 'VOTES CAST' }}</h3>
              <p class="text-5xl font-bold text-blue-400">{{stats?.total_votes | number}}</p>
            </div>
            <div class="bg-black border border-gray-800 rounded-2xl p-6">
              <h3 class="text-gray-500 font-bold mb-2">{{ translation.t('turnoutUpper') || 'TURNOUT' }}</h3>
              <p class="text-5xl font-bold text-green-400">{{ getPercentage() }}%</p>
            </div>
            <div class="bg-black border border-gray-800 rounded-2xl p-6">
              <h3 class="text-gray-500 font-bold mb-2">{{ translation.t('dbVelocity') || 'DB VELOCITY' }} ⚡</h3>
              <p class="text-5xl font-bold text-yellow-400 flex items-center gap-2">
                {{stats?.velocity | number}} <span class="text-lg text-gray-600">v/s</span>
              </p>
            </div>
          </div>

          <!-- Data Explorer Tabs bg-black border border-gray-800 rounded-2xl -->
          <div class="bg-black border border-gray-800 rounded-2xl overflow-hidden mt-8 shadow-2xl">
             <div class="flex border-b border-gray-800 bg-gray-900/50">
               <button (click)="activeTab = 'voters'; loadTabData()" [ngClass]="{'border-b-2 border-red-500 text-white': activeTab === 'voters', 'text-gray-500 hover:text-gray-300': activeTab !== 'voters'}" class="flex-1 py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none">{{ translation.t('registeredVoters') }}</button>
               <button (click)="activeTab = 'candidates'; loadTabData()" [ngClass]="{'border-b-2 border-red-500 text-white': activeTab === 'candidates', 'text-gray-500 hover:text-gray-300': activeTab !== 'candidates'}" class="flex-1 py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none">{{ translation.t('candidates') }}</button>
               <button (click)="activeTab = 'leaders'; loadTabData()" [ngClass]="{'border-b-2 border-red-500 text-white': activeTab === 'leaders', 'text-gray-500 hover:text-gray-300': activeTab !== 'leaders'}" class="flex-1 py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none">{{ translation.t('electionLeaders') }}</button>
               <button (click)="activeTab = 'votes'; loadTabData()" [ngClass]="{'border-b-2 border-red-500 text-white': activeTab === 'votes', 'text-gray-500 hover:text-gray-300': activeTab !== 'votes'}" class="flex-1 py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none flex items-center justify-center gap-2">{{ translation.t('liveAuditLog') }} <span class="animate-pulse w-2 h-2 rounded-full bg-red-500"></span></button>
            </div>
            
            <div class="p-0 overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
               <!-- Voters Table -->
               <div *ngIf="activeTab === 'voters'" class="w-full">
                  <div class="flex justify-between items-center p-4 bg-gray-900/40 border-b border-gray-800">
                     <div></div>
                     <button (click)="deleteAllVoters()" class="bg-red-900 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-colors">DELETE ALL VOTERS</button>
                  </div>
                  <table class="w-full text-left text-sm text-gray-400">
                     <thead class="text-xs text-gray-500 uppercase border-b border-gray-800 sticky top-0 bg-black z-10 shadow-md">
                        <tr><th class="py-4 px-6">{{ translation.t('voterCodeUpper') || 'VOTER CODE' }}</th><th class="py-4 px-6">{{ translation.t('fullNameUpper') || 'FULL NAME' }}</th><th class="py-4 px-6">PASSWORD HASH</th><th class="py-4 px-6">{{ translation.t('countyUpper') || 'COUNTY' }}</th><th class="py-4 px-6">{{ translation.t('constituencyUpper') || 'CONSTITUENCY' }}</th><th class="py-4 px-6">{{ translation.t('registeredAtUpper') || 'REGISTERED AT' }}</th><th class="py-4 px-6 text-right">{{ translation.t('actionUpper') || 'ACTIONS' }}</th></tr>
                     </thead>
                     <tbody>
                        <tr *ngFor="let v of voters" class="border-b border-gray-900 hover:bg-gray-900/50 transition-colors group">
                           <td class="py-4 px-6 font-mono text-white">{{v.voter_code}}</td>
                           <td class="py-4 px-6 font-semibold">{{v.full_name}}</td>
                           <td class="py-4 px-6 font-mono text-xs text-gray-500 max-w-[150px] truncate" [title]="v.password_hash">{{v.password_hash}}</td>
                           <td class="py-4 px-6">{{v.county}}</td>
                           <td class="py-4 px-6">{{v.constituency}}</td>
                           <td class="py-4 px-6 text-gray-500">{{v.created_at | date:'medium'}}</td>
                           <td class="py-4 px-6 text-right">
                              <div class="flex justify-end gap-2">
                                 <button (click)="resetVoterPassword(v.id)" class="bg-blue-900/30 hover:bg-blue-900 text-blue-500 hover:text-white px-3 py-1 rounded transition-colors font-bold text-xs uppercase cursor-pointer">RESET PW</button>
                                 <button (click)="deleteVoter(v.id)" class="bg-red-900/30 hover:bg-red-900 text-red-500 hover:text-white px-3 py-1 rounded transition-colors font-bold text-xs uppercase cursor-pointer">DELETE</button>
                              </div>
                           </td>
                        </tr>
                        <tr *ngIf="voters.length === 0"><td colspan="7" class="py-12 text-center text-gray-500">No records found.</td></tr>
                     </tbody>
                  </table>
               </div>

               <!-- Candidates Table -->
               <div *ngIf="activeTab === 'candidates'" class="w-full">
                  <div class="flex justify-between items-center p-4 bg-gray-900/40 border-b border-gray-800">
                     <div class="flex gap-4">
                        <input type="text" [(ngModel)]="searchQuery" placeholder="Search name or party..." class="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500 outline-none w-64">
                        <select [(ngModel)]="seatFilter" class="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500 outline-none">
                           <option value="">All Seats</option>
                           <option value="president">President</option>
                           <option value="governor">Governor</option>
                           <option value="senator">Senator</option>
                           <option value="mp">MP</option>
                           <option value="woman_rep">Woman Rep</option>
                           <option value="mca">MCA</option>
                        </select>
                     </div>
                     <div class="flex gap-2">
                        <button (click)="deleteAllCandidates()" class="bg-red-900 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-colors">DELETE ALL CANDIDATES</button>
                        <button (click)="isAddingCandidate = !isAddingCandidate" class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-colors">+ NEW CANDIDATE</button>
                     </div>
                  </div>

                  <!-- Add Candidate Modal Inline -->
                  <div *ngIf="isAddingCandidate" class="p-6 bg-black border-b border-gray-800 flex flex-wrap gap-4 items-end">
                      <div><label class="block text-xs text-gray-500 mb-1">Full Name</label><input type="text" [(ngModel)]="newCandidateName" class="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm w-64 outline-none"></div>
                      <div><label class="block text-xs text-gray-500 mb-1">Party</label><input type="text" [(ngModel)]="newCandidateParty" class="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm w-48 outline-none"></div>
                      <div><label class="block text-xs text-gray-500 mb-1">Target Seat (National)</label>
                         <select [(ngModel)]="newCandidateSeat" class="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm w-48 outline-none">
                            <option value="president">President</option>
                            <option value="governor">Governor</option>
                            <option value="senator">Senator</option>
                            <option value="mp">MP</option>
                            <option value="woman_rep">Woman Rep</option>
                            <option value="mca">MCA</option>
                         </select>
                      </div>
                      <button (click)="addCandidate()" class="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg">SAVE</button>
                      <button (click)="isAddingCandidate = false" class="text-gray-500 hover:text-white px-4 py-2">Cancel</button>
                  </div>

                  <table class="w-full text-left text-sm text-gray-400">
                    <thead class="text-xs text-gray-500 uppercase border-b border-gray-800 sticky top-0 bg-black z-10 shadow-md">
                       <tr><th class="py-4 px-6">{{ translation.t('fullNameUpper') || 'NAME' }}</th><th class="py-4 px-6">{{ translation.t('party') || 'PARTY' }}</th><th class="py-4 px-6">{{ translation.t('seatName') || 'SEAT' }}</th><th class="py-4 px-6">{{ translation.t('level') || 'LEVEL' }}</th><th class="py-4 px-6 text-right">{{ translation.t('actionUpper') || 'ACTIONS' }}</th></tr>
                    </thead>
                    <tbody>
                       <tr *ngFor="let c of filteredCandidates" class="border-b border-gray-900 hover:bg-gray-900/50 transition-colors group">
                          <td class="py-4 px-6 font-bold text-white">{{c.full_name}}</td>
                          <td class="py-4 px-6">{{c.party}}</td>
                          <td class="py-4 px-6 text-green-400 font-semibold">{{c.seat_name}}</td>
                          <td class="py-4 px-6 uppercase text-gray-500">{{c.seat_level}}</td>
                          <td class="py-4 px-6 text-right"><button (click)="deleteCandidate(c.id)" class="bg-red-900/30 hover:bg-red-900 text-red-500 hover:text-white px-3 py-1 rounded transition-colors font-bold text-xs uppercase cursor-pointer">DELETE</button></td>
                       </tr>
                       <tr *ngIf="filteredCandidates.length === 0"><td colspan="5" class="py-12 text-center text-gray-500">No records found.</td></tr>
                    </tbody>
                  </table>
               </div>

               <!-- Leaders Table -->
               <div *ngIf="activeTab === 'leaders'" class="w-full">
                  <div class="flex justify-between items-center p-4 bg-gray-900/40 border-b border-gray-800">
                     <select [(ngModel)]="leaderSeatFilter" class="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500 outline-none w-64">
                        <option value="">All Seats</option>
                        <option value="president">President</option>
                        <option value="governor">Governor</option>
                        <option value="senator">Senator</option>
                        <option value="mp">MP</option>
                        <option value="woman_rep">Woman Rep</option>
                        <option value="mca">MCA</option>
                     </select>
                  </div>
                  <table class="w-full text-left text-sm text-gray-400">
                    <thead class="text-xs text-gray-500 uppercase border-b border-gray-800 sticky top-0 bg-black z-10 shadow-md">
                       <tr><th class="py-4 px-6">{{ translation.t('seatName') || 'SEAT NAME' }}</th><th class="py-4 px-6">{{ translation.t('candidate') || 'LEADING CANDIDATE' }}</th><th class="py-4 px-6">{{ translation.t('party') || 'PARTY' }}</th><th class="py-4 px-6 text-right">{{ translation.t('totalVotes') || 'TOTAL VOTES' }}</th></tr>
                    </thead>
                    <tbody>
                       <tr *ngFor="let l of filteredLeaders" class="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                          <td class="py-4 px-6 text-blue-400 font-bold tracking-wide uppercase text-xs">{{l.seat_name}}</td>
                          <td class="py-4 px-6 font-bold text-green-400">{{l.candidate}}</td>
                          <td class="py-4 px-6">{{l.party}}</td>
                          <td class="py-4 px-6 text-right font-mono text-white text-lg">{{l.votes | number}}</td>
                       </tr>
                       <tr *ngIf="filteredLeaders.length === 0"><td colspan="4" class="py-12 text-center text-gray-500">No leaders to display.</td></tr>
                    </tbody>
                  </table>
               </div>

               <!-- Votes Audit Table -->
               <table *ngIf="activeTab === 'votes'" class="w-full text-left text-sm text-gray-400">
                  <thead class="text-xs text-gray-500 uppercase border-b border-gray-800 sticky top-0 bg-black z-10 shadow-md">
                     <tr><th class="py-4 px-6">{{ translation.t('timestampUpper') || 'TIMESTAMP' }}</th><th class="py-4 px-6">{{ translation.t('voterCodeUpper') || 'VOTER NAME/CODE' }}</th><th class="py-4 px-6">{{ translation.t('seatName') || 'SEAT' }}</th><th class="py-4 px-6">{{ translation.t('candidate') || 'SELECTED CANDIDATE' }}</th></tr>
                  </thead>
                  <tbody>
                     <tr *ngFor="let v of votes" class="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                        <td class="py-4 px-6 text-xs font-mono text-gray-500">{{v.time | date:'mediumTime'}}</td>
                        <td class="py-4 px-6 text-white font-mono font-medium">{{v.voter_name}} <span class="text-gray-600 block text-xs mt-1">{{v.voter_code}}</span></td>
                        <td class="py-4 px-6 text-blue-400 font-bold uppercase tracking-wide text-xs">{{v.seat}}</td>
                        <td class="py-4 px-6 font-bold text-green-400">{{v.candidate}}</td>
                     </tr>
                     <tr *ngIf="votes.length === 0"><td colspan="4" class="py-12 text-center text-gray-500">No votes recorded yet.</td></tr>
                  </tbody>
               </table>
            </div>
          </div>

        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  adminKey = '';
  errorMsg = '';
  loading = false;
  
  token = '';
  stats: any = null;
  refreshInterval: any;

  activeTab: 'voters' | 'candidates' | 'votes' | 'leaders' = 'voters';
  voters: any[] = [];
  candidates: any[] = [];
  votes: any[] = [];
  leaders: any[] = [];

  searchQuery = '';
  seatFilter = '';
  leaderSeatFilter = '';
  
  newCandidateName = '';
  newCandidateParty = '';
  newCandidateSeat = 'president';
  isAddingCandidate = false;

  get filteredCandidates() {
    return this.candidates.filter(c => {
      const matchSearch = c.full_name.toLowerCase().includes(this.searchQuery.toLowerCase()) || (c.party && c.party.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchSeat = this.seatFilter ? c.seat_type === this.seatFilter : true;
      return matchSearch && matchSeat;
    });
  }

  get filteredLeaders() {
    return this.leaders.filter(l => {
      return this.leaderSeatFilter ? l.seat_level === this.leaderSeatFilter || l.seat_name.toLowerCase().includes(this.leaderSeatFilter.toLowerCase()) : true;
    });
  }

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translation: TranslationService
  ) {}

  ngOnInit() {
    window.addEventListener('langChanged', () => this.cdr.detectChanges());
    const savedToken = localStorage.getItem('uchaguzi_admin_token');
    if (savedToken) {
      this.token = savedToken;
      this.isAuthenticated = true;
      this.loadStats();
      this.loadTabData();
      this.startPolling();
    }
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  login() {
    if (!this.adminKey.trim()) return;
    this.loading = true;
    this.errorMsg = '';

    this.api.adminLogin(this.adminKey).subscribe({
      next: (res) => {
        this.token = res.token;
        localStorage.setItem('uchaguzi_admin_token', this.token);
        this.isAuthenticated = true;
        this.loading = false;
        this.adminKey = '';
        this.loadStats();
        this.loadTabData();
        this.startPolling();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = 'ACCESS DENIED. INVALID HASH.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToDashboard() {
    localStorage.removeItem('uchaguzi_admin_token');
    this.isAuthenticated = false;
    this.token = '';
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.router.navigate(['/']);
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  startPolling() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
       this.loadStats();
       this.loadTabData();
    }, 2000);
  }

  loadTabData() {
    if (!this.token) return;
    if (this.activeTab === 'voters') {
      this.api.getAdminVoters(this.token).subscribe(res => { this.voters = res; this.cdr.detectChanges(); });
    } else if (this.activeTab === 'candidates') {
      this.api.getAdminCandidates(this.token).subscribe(res => { this.candidates = res; this.cdr.detectChanges(); });
    } else if (this.activeTab === 'votes') {
      this.api.getAdminVotes(this.token).subscribe(res => { this.votes = res; this.cdr.detectChanges(); });
    } else if (this.activeTab === 'leaders') {
      this.api.getAdminLeaders(this.token).subscribe(res => { this.leaders = res; this.cdr.detectChanges(); });
    }
  }

  loadStats() {
    if (!this.token) return;
    this.api.getAdminStats(this.token).subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.goToDashboard(); // Kicked out
      }
    });
  }

  getPercentage(): string {
    if (!this.stats || !this.stats.total_voters) return '0.0';
    const active = this.stats.active_voters !== undefined ? this.stats.active_voters : (this.stats.total_votes > this.stats.total_voters ? this.stats.total_voters : this.stats.total_votes);
    return ((active / this.stats.total_voters) * 100).toFixed(1);
  }

  toggleHalt() {
     this.api.toggleHalt(this.token).subscribe(res => {
         this.loadStats();
     });
  }

  restartElection() {
      if(confirm('🚨 CRITICAL WARNING 🚨\n\nAre you absolutely sure you want to WIPE all cast votes? This will restart the election from 0. Candidates and Registered Voters will NOT be deleted.')) {
          this.api.restartElection(this.token).subscribe(res => {
              alert(res.message);
              this.loadStats();
              this.loadTabData();
          });
      }
  }

  deleteCandidate(id: number) {
     if(confirm("DANGER: Delete this candidate and ALL votes associated with them?")) {
         this.api.deleteAdminCandidate(this.token, id).subscribe(() => this.loadTabData());
     }
  }

  addCandidate() {
     if(!this.newCandidateName || !this.newCandidateParty) return;
     this.api.addAdminCandidate(this.token, {
          full_name: this.newCandidateName,
          party: this.newCandidateParty,
          seat_type: this.newCandidateSeat
     }).subscribe(() => {
          this.isAddingCandidate = false;
          this.newCandidateName = '';
          this.newCandidateParty = '';
          this.loadTabData();
     });
  }

  deleteAllCandidates() {
     if(confirm("🚨 CRITICAL WARNING 🚨\n\nAre you sure you want to DELETE ALL CANDIDATES and their associated votes? This cannot be undone.")) {
         this.api.deleteAllAdminCandidates(this.token).subscribe(() => {
             this.loadTabData();
             this.loadStats();
         });
     }
  }

  resetVoterPassword(id: number) {
     if(confirm("Are you sure you want to reset this voter's password to 'IEBC2026!'?")) {
         this.api.resetAdminVoterPassword(this.token, id).subscribe(res => {
             alert(res.message);
             this.loadTabData();
         });
     }
  }

  deleteVoter(id: number) {
     if(confirm("DANGER: Delete this voter and ALL votes associated with them?")) {
         this.api.deleteAdminVoter(this.token, id).subscribe(() => {
             this.loadTabData();
             this.loadStats();
         });
     }
  }

  deleteAllVoters() {
     if(confirm("🚨 CRITICAL WARNING 🚨\n\nAre you sure you want to DELETE ALL VOTERS and their associated votes? This cannot be undone.")) {
         this.api.deleteAllAdminVoters(this.token).subscribe(() => {
             this.loadTabData();
             this.loadStats();
         });
     }
  }
}

// trigger recompile

// force recompile
