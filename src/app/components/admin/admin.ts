import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CONSTITUENCIES } from '../../shared/constituencies';

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
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen transition-colors duration-300" style="background: var(--bg-primary); color: var(--text-primary)">
      
      <!-- Login View -->
      <div *ngIf="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541872703864-f97167ea85fa?q=80&w=2070')] bg-cover bg-center">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div class="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl shadow-red-900/20 border" style="background: var(--bg-card); border-color: var(--border-color)">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 mb-2">IEBC</h1>
            <p class="font-bold tracking-widest text-sm" style="color: var(--text-secondary)">SECURE COMMAND CENTER</p>
          </div>
          
          <div *ngIf="errorMsg" class="bg-red-900/40 text-red-400 p-4 rounded-lg mb-6 border border-red-500/50 text-center">
            {{ errorMsg }}
          </div>

          <div class="space-y-6">
            <div>
              <label class="block mb-2 text-sm font-bold uppercase" style="color: var(--text-secondary)">Root Access Key</label>
              <input type="password" [(ngModel)]="adminKey" (keyup.enter)="login()"
                     class="w-full border-2 rounded-xl p-4 font-mono focus:border-red-600 focus:outline-none transition-colors"
                     style="background: var(--bg-primary); color: var(--text-primary); border-color: var(--border-color)"
                     placeholder="••••••••">
            </div>
            <button (click)="login()" [disabled]="loading"
                    class="w-full py-4 bg-gradient-to-r from-red-700 hover:from-red-600 to-red-900 text-white font-bold rounded-xl uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50">
              {{ loading ? 'Authenticating...' : 'Enter System' }}
            </button>
            <button (click)="goTo('/')" class="w-full py-2 text-sm mt-4 transition-colors" style="color: var(--text-secondary)">
              Return to Public Portal
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard View -->
      <div *ngIf="isAuthenticated" class="min-h-screen font-mono" style="background: var(--bg-primary)">
        <div class="text-white px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center border-b-4 border-red-600 shadow-lg gap-4" style="background: #991b1b">
          <div class="flex items-center gap-4">
            <span class="text-2xl animate-pulse">🔴</span>
            <div>
              <h1 class="font-bold text-xl tracking-widest">{{ translation.t('electionCommandCenter') || 'ELECTION COMMAND CENTER' }}</h1>
              <p class="text-xs text-red-200">{{ translation.t('liveSystemObservatory') || 'LIVE SYSTEM OBSERVATORY' }}</p>
            </div>
          </div>
          <div class="flex gap-4 items-center w-full md:w-auto justify-between md:justify-end">
            <button (click)="translation.toggleLang()" class="px-4 py-2 bg-black/30 hover:bg-black/50 text-white border border-white/20 rounded-lg font-bold transition-colors">
              {{ translation.currentLang === 'en' ? 'SW' : 'EN' }}
            </button>
            <button (click)="goToDashboard()" class="px-6 py-2 bg-black/30 hover:bg-black/50 text-white border border-white/20 rounded-lg transition-colors">{{ translation.t('goToDashboardUpper') || 'GO TO DASHBOARD' }}</button>
          </div>
        </div>

        <div class="p-8 max-w-7xl mx-auto grid gap-8">
          
          <!-- Control Panel -->
          <div class="border rounded-2xl p-8 relative overflow-hidden transition-colors" style="background: var(--bg-card); border-color: var(--border-color)">
             <div class="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
             <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                 <div class="text-center md:text-left">
                   <h2 class="text-2xl font-bold mb-2" style="color: var(--text-primary)">{{ translation.t('electionStatus') || 'ELECTION STATUS' }}: <span [ngClass]="{'text-green-500': stats?.is_active, 'text-red-500 animate-pulse': stats?.is_active === false}">{{stats === null ? 'LOADING...' : (stats?.is_active ? (translation.t('activeUpper') || 'ACTIVE') : 'HALTED')}}</span></h2>
                   <p style="color: var(--text-secondary)" class="min-h-[40px]">{{stats?.is_active ? translation.t('systemAccepting') : 'blocking all incoming vote attempts.'}}</p>
                </div>
                <div class="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                   <button (click)="toggleHalt()" [ngClass]="{'text-red-500 border-red-600 hover:bg-red-600 hover:text-white': stats?.is_active, 'bg-red-600 text-white border-red-500 hover:bg-red-700': stats?.is_active === false}" class="px-8 py-3 bg-red-600/10 border rounded-xl font-bold text-lg w-full sm:w-64 transition-all">
                     {{stats?.is_active ? (translation.t('haltElection') || 'HALT ELECTION') : 'RESUME ELECTION'}}
                   </button>
                   <button (click)="restartElection()" class="px-8 py-2 border border-orange-600/50 text-orange-500 hover:bg-orange-600 hover:text-white rounded-xl font-bold text-xs w-full sm:w-64 transition-all cursor-pointer">
                     {{ translation.t('wipeDatabase') || 'WIPE DATABASE & RESTART' }}
                   </button>
                </div>
             </div>
          </div>

          <!-- Live Metrics Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div class="border rounded-2xl p-6 transition-colors" style="background: var(--bg-card); border-color: var(--border-color)">
              <h3 class="font-bold mb-2 uppercase text-xs tracking-widest" style="color: var(--text-secondary)">{{ translation.t('totalRegisteredUpper') || 'TOTAL REGISTERED' }}</h3>
              <p class="text-5xl font-bold" style="color: var(--text-primary)">{{stats?.total_voters | number}}</p>
            </div>
            <div class="border rounded-2xl p-6 transition-colors" style="background: var(--bg-card); border-color: var(--border-color)">
              <h3 class="font-bold mb-2 uppercase text-xs tracking-widest" style="color: var(--text-secondary)">{{ translation.t('votesCastUpper') || 'VOTES CAST' }}</h3>
              <p class="text-5xl font-bold text-blue-500">{{stats?.total_votes | number}}</p>
            </div>
            <div class="border rounded-2xl p-6 transition-colors" style="background: var(--bg-card); border-color: var(--border-color)">
              <h3 class="font-bold mb-2 uppercase text-xs tracking-widest" style="color: var(--text-secondary)">{{ translation.t('turnoutUpper') || 'TURNOUT' }}</h3>
              <p class="text-5xl font-bold text-green-500">{{ getPercentage() }}%</p>
            </div>
            <div class="border rounded-2xl p-6 transition-colors" style="background: var(--bg-card); border-color: var(--border-color)">
              <h3 class="font-bold mb-2 uppercase text-xs tracking-widest" style="color: var(--text-secondary)">{{ translation.t('dbVelocity') || 'DB VELOCITY' }} ⚡</h3>
              <p class="text-5xl font-bold text-yellow-500 flex items-center gap-2">
                {{stats?.velocity | number}} <span class="text-lg text-gray-400">v/s</span>
              </p>
            </div>
          </div>

          <!-- Data Explorer Tabs -->
          <div class="border rounded-2xl overflow-hidden mt-8 shadow-2xl transition-colors" style="background: var(--bg-card); border-color: var(--border-color)">
             <div class="flex flex-wrap border-b" style="background: var(--bg-primary); border-color: var(--border-color)">
               <button (click)="activeTab = 'voters'; loadTabData()" [ngClass]="{'border-b-2 border-red-500': activeTab === 'voters'}" class="flex-1 min-w-[120px] py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none" style="color: var(--text-primary)">{{ translation.t('registeredVoters') }}</button>
               <button (click)="activeTab = 'candidates'; loadTabData()" [ngClass]="{'border-b-2 border-red-500': activeTab === 'candidates'}" class="flex-1 min-w-[120px] py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none" style="color: var(--text-primary)">{{ translation.t('candidates') }}</button>
               <button (click)="activeTab = 'leaders'; loadTabData()" [ngClass]="{'border-b-2 border-red-500': activeTab === 'leaders'}" class="flex-1 min-w-[120px] py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none" style="color: var(--text-primary)">{{ translation.t('electionLeaders') }}</button>
               <button (click)="activeTab = 'votes'; loadTabData()" [ngClass]="{'border-b-2 border-red-500': activeTab === 'votes'}" class="flex-1 min-w-[120px] py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none flex items-center justify-center gap-2" style="color: var(--text-primary)">{{ translation.t('liveAuditLog') }} <span class="animate-pulse w-2 h-2 rounded-full bg-red-500"></span></button>
               <button (click)="activeTab = 'reports'" [ngClass]="{'border-b-2 border-red-500': activeTab === 'reports'}" class="flex-1 min-w-[120px] py-4 font-bold tracking-widest text-sm transition-colors outline-none focus:outline-none flex items-center justify-center gap-2" style="color: var(--text-primary)">📄 REPORTS</button>
            </div>
            
            <div class="p-0 overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
               <!-- Voters Table -->
               <div *ngIf="activeTab === 'voters'" class="w-full">
                  <div class="flex justify-between items-center p-4 border-b gap-4 flex-wrap" style="background: var(--bg-primary); border-color: var(--border-color)">
                     <div class="flex gap-2 items-center text-sm font-bold" style="color: var(--text-secondary)">
                        <button (click)="voterPage = voterPage - 1" [disabled]="voterPage === 1" class="px-3 py-1 bg-black/20 rounded hover:bg-black/40 disabled:opacity-50 transition-colors">← Prev</button>
                        <span>Page {{voterPage}} of {{totalVoterPages || 1}} ({{voters.length}} total)</span>
                        <button (click)="voterPage = voterPage + 1" [disabled]="voterPage >= totalVoterPages" class="px-3 py-1 bg-black/20 rounded hover:bg-black/40 disabled:opacity-50 transition-colors">Next →</button>
                     </div>
                     <button (click)="deleteAllVoters()" class="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-colors">DELETE ALL VOTERS</button>
                  </div>
                  <table class="w-full text-left text-sm">
                     <thead class="text-xs uppercase border-b sticky top-0 z-10 shadow-sm" style="background: var(--bg-card); border-color: var(--border-color); color: var(--text-secondary)">
                        <tr><th class="py-4 px-6">{{ translation.t('voterCodeUpper') || 'VOTER CODE' }}</th><th class="py-4 px-6">{{ translation.t('fullNameUpper') || 'FULL NAME' }}</th><th class="py-4 px-6">PASSWORD HASH</th><th class="py-4 px-6">{{ translation.t('countyUpper') || 'COUNTY' }}</th><th class="py-4 px-6">{{ translation.t('constituencyUpper') || 'CONSTITUENCY' }}</th><th class="py-4 px-6">{{ translation.t('registeredAtUpper') || 'REGISTERED AT' }}</th><th class="py-4 px-6 text-right">{{ translation.t('actionUpper') || 'ACTIONS' }}</th></tr>
                     </thead>
                     <tbody style="color: var(--text-primary)">
                        <tr *ngFor="let v of paginatedVoters" class="border-b hover:bg-black/5 transition-colors group" style="border-color: var(--border-color)">
                           <td class="py-4 px-6 font-mono font-bold">{{v.voter_code}}</td>
                           <td class="py-4 px-6 font-semibold">{{v.full_name}}</td>
                           <td class="py-4 px-6 font-mono text-xs max-w-[150px] truncate" [title]="v.password_hash" style="color: var(--text-secondary)">{{v.password_hash}}</td>
                           <td class="py-4 px-6">{{v.county}}</td>
                           <td class="py-4 px-6">{{v.constituency}}</td>
                           <td class="py-4 px-6" style="color: var(--text-secondary)">{{v.created_at | date:'medium'}}</td>
                           <td class="py-4 px-6 text-right">
                              <div class="flex justify-end gap-2">
                                 <button (click)="resetVoterPassword(v.id)" class="bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white px-3 py-1 rounded border border-blue-600/30 transition-colors font-bold text-xs uppercase cursor-pointer">RESET PW</button>
                                 <button (click)="deleteVoter(v.id)" class="bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white px-3 py-1 rounded border border-red-600/30 transition-colors font-bold text-xs uppercase cursor-pointer">DELETE</button>
                              </div>
                           </td>
                        </tr>
                        <tr *ngIf="voters.length === 0"><td colspan="7" class="py-12 text-center" style="color: var(--text-secondary)">No records found.</td></tr>
                     </tbody>
                  </table>
                  <div class="flex justify-center items-center p-4 border-t gap-4" style="background: var(--bg-primary); border-color: var(--border-color)">
                     <div class="flex gap-2 items-center text-sm font-bold" style="color: var(--text-secondary)">
                        <button (click)="voterPage = voterPage - 1" [disabled]="voterPage === 1" class="px-3 py-1 bg-black/20 rounded hover:bg-black/40 disabled:opacity-50 transition-colors">← Prev</button>
                        <span>Page {{voterPage}} of {{totalVoterPages || 1}} ({{voters.length}} total)</span>
                        <button (click)="voterPage = voterPage + 1" [disabled]="voterPage >= totalVoterPages" class="px-3 py-1 bg-black/20 rounded hover:bg-black/40 disabled:opacity-50 transition-colors">Next →</button>
                     </div>
                  </div>
               </div>

               <!-- Candidates Table -->
               <div *ngIf="activeTab === 'candidates'" class="w-full">
                  <div class="flex flex-col sm:flex-row justify-between items-center p-4 border-b gap-4" style="background: var(--bg-primary); border-color: var(--border-color)">
                     <div class="flex flex-wrap gap-4 w-full sm:w-auto">
                        <input type="text" [(ngModel)]="searchQuery" placeholder="Search name or party..." class="border rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none w-full sm:w-64" style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color)">
                        <select [(ngModel)]="seatFilter" class="border rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none w-full sm:w-48" style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color)">
                           <option value="">All Seats</option>
                           <option value="president">President</option>
                           <option value="governor">Governor</option>
                           <option value="senator">Senator</option>
                           <option value="mp">MP</option>
                           <option value="woman_rep">Woman Rep</option>
                           <option value="mca">MCA</option>
                        </select>
                      </div>
                      <div class="flex gap-2 w-full sm:w-auto">
                        <button (click)="deleteAllCandidates()" class="flex-1 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-colors">DELETE ALL</button>
                        <button (click)="isAddingCandidate = !isAddingCandidate" class="flex-1 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-colors">+ NEW</button>
                      </div>
                  </div>
                  
                  <div class="p-2 border-b flex justify-between items-center bg-black/10" style="border-color: var(--border-color)">
                     <div class="flex gap-2 items-center text-sm font-bold mx-auto" style="color: var(--text-secondary)">
                        <button (click)="candidatePage = candidatePage - 1" [disabled]="candidatePage === 1" class="px-3 py-1 bg-black/20 rounded hover:bg-black/40 disabled:opacity-50 transition-colors">← Prev</button>
                        <span>Page {{candidatePage}} of {{totalCandidatePages || 1}} ({{filteredCandidates.length}} matches)</span>
                        <button (click)="candidatePage = candidatePage + 1" [disabled]="candidatePage >= totalCandidatePages" class="px-3 py-1 bg-black/20 rounded hover:bg-black/40 disabled:opacity-50 transition-colors">Next →</button>
                     </div>
                  </div>

                  <!-- Add Candidate Modal Inline -->
                  <div *ngIf="isAddingCandidate" class="p-6 border-b flex flex-wrap gap-4 items-end transition-colors" style="background: var(--bg-primary); border-color: var(--border-color)">
                      <div class="w-full sm:w-auto"><label class="block text-xs mb-1" style="color: var(--text-secondary)">Full Name</label><input type="text" [(ngModel)]="newCandidateName" class="border rounded-lg px-4 py-2 text-sm w-full sm:w-64 outline-none" style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color)"></div>
                      <div class="w-full sm:w-auto"><label class="block text-xs mb-1" style="color: var(--text-secondary)">Party</label><input type="text" [(ngModel)]="newCandidateParty" class="border rounded-lg px-4 py-2 text-sm w-full sm:w-48 outline-none" style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color)"></div>
                      <div class="w-full sm:w-auto"><label class="block text-xs mb-1" style="color: var(--text-secondary)">Target Seat (National)</label>
                         <select [(ngModel)]="newCandidateSeat" class="border rounded-lg px-4 py-2 text-sm w-full sm:w-48 outline-none" style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color)">
                            <option value="president">President</option>
                            <option value="governor">Governor</option>
                            <option value="senator">Senator</option>
                            <option value="mp">MP</option>
                            <option value="woman_rep">Woman Rep</option>
                            <option value="mca">MCA</option>
                         </select>
                      </div>
                      <button (click)="addCandidate()" class="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg w-full sm:w-auto">SAVE</button>
                      <button (click)="isAddingCandidate = false" class="px-4 py-2 w-full sm:w-auto" style="color: var(--text-secondary)">Cancel</button>
                  </div>

                  <table class="w-full text-left text-sm">
                    <thead class="text-xs uppercase border-b sticky top-0 z-10 shadow-sm" style="background: var(--bg-card); border-color: var(--border-color); color: var(--text-secondary)">
                       <tr><th class="py-4 px-6">{{ translation.t('fullNameUpper') || 'NAME' }}</th><th class="py-4 px-6">{{ translation.t('party') || 'PARTY' }}</th><th class="py-4 px-6">{{ translation.t('seatName') || 'SEAT' }}</th><th class="py-4 px-6">{{ translation.t('level') || 'LEVEL' }}</th><th class="py-4 px-6 text-right">{{ translation.t('actionUpper') || 'ACTIONS' }}</th></tr>
                    </thead>
                    <tbody style="color: var(--text-primary)">
                       <tr *ngFor="let c of paginatedCandidates" class="border-b hover:bg-black/5 transition-colors group" style="border-color: var(--border-color)">
                          <td class="py-4 px-6 font-bold">{{c.full_name}}</td>
                          <td class="py-4 px-6">{{c.party}}</td>
                          <td class="py-4 px-6 text-green-600 font-semibold">{{c.seat_name}}</td>
                          <td class="py-4 px-6 uppercase" style="color: var(--text-secondary)">{{c.seat_level}}</td>
                          <td class="py-4 px-6 text-right"><button (click)="deleteCandidate(c.id)" class="bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white px-3 py-1 rounded border border-red-600/30 transition-colors font-bold text-xs uppercase cursor-pointer">DELETE</button></td>
                       </tr>
                        <tr *ngIf="filteredCandidates.length === 0">
                           <td colspan="5" class="py-20 text-center" style="color: var(--text-secondary)">
                              <div class="text-4xl mb-2">🤷‍♂️</div>
                              <p class="font-bold">No candidates found.</p>
                              <p class="font-bold">No candidates found.</p>
                           </td>
                        </tr>
                    </tbody>
                  </table>
                  <div class="flex justify-center items-center p-4 border-t gap-4" style="background: var(--bg-primary); border-color: var(--border-color)">
                     <div class="flex gap-2 items-center text-sm font-bold" style="color: var(--text-secondary)">
                        <button (click)="candidatePage = candidatePage - 1" [disabled]="candidatePage === 1" class="px-3 py-1 bg-black/20 rounded hover:bg-black/40 disabled:opacity-50 transition-colors">← Prev</button>
                        <span>Page {{candidatePage}} of {{totalCandidatePages || 1}} ({{filteredCandidates.length}} matches)</span>
                        <button (click)="candidatePage = candidatePage + 1" [disabled]="candidatePage >= totalCandidatePages" class="px-3 py-1 bg-black/20 rounded hover:bg-black/40 disabled:opacity-50 transition-colors">Next →</button>
                     </div>
                  </div>
               </div>

               <!-- Leaders Table -->
               <div *ngIf="activeTab === 'leaders'" class="w-full">
                  <div class="p-4 border-b" style="background: var(--bg-primary); border-color: var(--border-color)">
                     <select [(ngModel)]="leaderSeatFilter" class="border rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none w-full sm:w-64" style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color)">
                        <option value="">All Seats</option>
                        <option value="president">President</option>
                        <option value="governor">Governor</option>
                        <option value="senator">Senator</option>
                        <option value="mp">MP</option>
                        <option value="woman_rep">Woman Rep</option>
                        <option value="mca">MCA</option>
                     </select>
                  </div>
                  <table class="w-full text-left text-sm">
                    <thead class="text-xs uppercase border-b sticky top-0 z-10 shadow-sm" style="background: var(--bg-card); border-color: var(--border-color); color: var(--text-secondary)">
                       <tr><th class="py-4 px-6">{{ translation.t('seatName') || 'SEAT NAME' }}</th><th class="py-4 px-6">{{ translation.t('candidate') || 'LEADING CANDIDATE' }}</th><th class="py-4 px-6">{{ translation.t('party') || 'PARTY' }}</th><th class="py-4 px-6 text-right">{{ translation.t('totalVotes') || 'TOTAL VOTES' }}</th></tr>
                    </thead>
                    <tbody style="color: var(--text-primary)">
                       <tr *ngFor="let l of filteredLeaders" class="border-b hover:bg-black/5 transition-colors" style="border-color: var(--border-color)">
                          <td class="py-4 px-6 text-blue-600 font-bold tracking-wide uppercase text-xs">
                             {{l.seat_name}}
                             <span *ngIf="l.level !== 'National'" class="block text-[10px] text-gray-500 mt-1">
                               {{ l.level }} Level
                             </span>
                          </td>
                          <td class="py-4 px-6 font-bold text-green-600">{{l.leader_name}}</td>
                          <td class="py-4 px-6 font-semibold" style="color: var(--text-secondary)">{{l.leader_party}}</td>
                          <td class="py-4 px-6 text-right font-mono text-lg font-bold">{{l.votes | number}}</td>
                       </tr>
                       <tr *ngIf="filteredLeaders.length === 0"><td colspan="4" class="py-12 text-center" style="color: var(--text-secondary)">No leaders to display.</td></tr>
                    </tbody>
                  </table>
               </div>
               <!-- Votes Audit Table -->
               <div *ngIf="activeTab === 'votes'" class="w-full">
                   <table class="w-full text-left text-sm">
                     <thead class="text-xs uppercase border-b sticky top-0 z-10 shadow-sm" style="background: var(--bg-card); border-color: var(--border-color); color: var(--text-secondary)">
                        <tr>
                          <th class="py-4 px-6">{{ translation.t('timestampUpper') || 'TIMESTAMP' }}</th>
                          <th class="py-4 px-6">{{ translation.t('voterCodeUpper') || 'VOTER NAME/CODE' }}</th>
                          <th class="py-4 px-6">{{ translation.t('seatName') || 'SEAT' }}</th>
                          <th class="py-4 px-6">{{ translation.t('candidate') || 'SELECTED CANDIDATE' }}</th>
                        </tr>
                     </thead>
                     <tbody style="color: var(--text-primary)">
                        <tr *ngFor="let v of votes" class="border-b hover:bg-black/5 transition-colors group" style="border-color: var(--border-color)">
                           <td class="py-4 px-6 text-xs text-gray-500">{{v.time | date:'medium'}}</td>
                           <td class="py-4 px-6 font-bold">{{v.voter_name}} <span class="block text-[10px] text-gray-400 font-mono">{{v.voter_code}}</span></td>
                           <td class="py-4 px-6 text-blue-600 font-semibold">{{v.seat}}</td>
                           <td class="py-4 px-6 font-bold text-green-600">{{v.candidate}}</td>
                        </tr>
                        <tr *ngIf="votes.length === 0">
                           <td colspan="4" class="py-20 text-center" style="color: var(--text-secondary)">
                              <div class="text-4xl mb-2">🕵️‍♂️</div>
                              <p class="font-bold">No votes recorded in the Live Audit Log yet.</p>
                           </td>
                        </tr>
                     </tbody>
                   </table>
                </div>

                <!-- Reports Tab -->
                <div *ngIf="activeTab === 'reports'" class="w-full p-8">
                   <h3 class="text-2xl font-bold mb-6" style="color: var(--text-primary)">Export PDF Reports</h3>
                   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div class="border rounded-2xl p-6 transition-colors shadow-lg flex flex-col justify-between" style="background: var(--bg-card); border-color: var(--border-color)">
                         <div>
                            <h4 class="font-bold text-lg mb-2 text-blue-500">📊 Election Results Summary</h4>
                            <p class="text-sm mb-4" style="color: var(--text-secondary)">Overview of all seats, winning candidates, and total votes per seat.</p>
                         </div>
                         <button (click)="downloadReport('election-results')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors">Download PDF</button>
                      </div>

                      <div class="border rounded-2xl p-6 transition-colors shadow-lg flex flex-col justify-between" style="background: var(--bg-card); border-color: var(--border-color)">
                         <div>
                            <h4 class="font-bold text-lg mb-2 text-green-500">📈 Voter Turnout Report</h4>
                            <p class="text-sm mb-4" style="color: var(--text-secondary)">Metrics on total registered voters vs total ballots cast.</p>
                         </div>
                         <button (click)="downloadReport('voter-turnout')" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors">Download PDF</button>
                      </div>

                      <div class="border rounded-2xl p-6 transition-colors shadow-lg flex flex-col justify-between" style="background: var(--bg-card); border-color: var(--border-color)">
                         <div>
                            <h4 class="font-bold text-lg mb-2 text-purple-500">👥 Registered Voters List</h4>
                            <p class="text-sm mb-4" style="color: var(--text-secondary)">Internal log of registered voters (passwords and secure data excluded).</p>
                         </div>
                         <button (click)="downloadReport('registered-voters')" class="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-colors">Download PDF</button>
                      </div>

                      <div class="border rounded-2xl p-6 transition-colors shadow-lg flex flex-col justify-between" style="background: var(--bg-card); border-color: var(--border-color)">
                         <div>
                            <h4 class="font-bold text-lg mb-2 text-red-500">🕵️ Audit Trail Log</h4>
                            <p class="text-sm mb-4" style="color: var(--text-secondary)">Immutable timestamped record of every vote cast in the system.</p>
                         </div>
                         <button (click)="downloadReport('audit-trail')" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors">Download PDF</button>
                      </div>

                      <div class="border rounded-2xl p-6 transition-colors shadow-lg flex flex-col justify-between" style="background: var(--bg-card); border-color: var(--border-color)">
                         <div>
                            <h4 class="font-bold text-lg mb-2 text-yellow-500">🏆 Candidate Performance</h4>
                            <p class="text-sm mb-4" style="color: var(--text-secondary)">Deep dive into individual candidate vote shares and overall rankings.</p>
                         </div>
                         <button (click)="downloadReport('candidate-performance')" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-bold transition-colors">Download PDF</button>
                      </div>

                      <!-- Regional Analysis Report -->
                      <div class="border rounded-2xl p-6 transition-colors shadow-lg flex flex-col justify-between" style="background: var(--bg-card); border-color: var(--border-color)">
                         <div>
                            <h4 class="font-bold text-lg mb-2 text-indigo-500">🗺️ Regional Analytics Report</h4>
                            <p class="text-sm mb-4" style="color: var(--text-secondary)">Deep dive into specific provinces, counties, or constituencies.</p>
                            
                            <div class="space-y-3 mb-4">
                               <select [(ngModel)]="regionalProvince" (ngModelChange)="onRegionalProvinceChange()" class="w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors" style="background: var(--bg-primary); color: var(--text-primary); border-color: var(--border-color)">
                                  <option value="">-- All Provinces (National) --</option>
                                  <option *ngFor="let p of regionalProvinces" [value]="p">{{ p }}</option>
                               </select>
                               
                               <select [(ngModel)]="regionalCounty" (ngModelChange)="onRegionalCountyChange()" [disabled]="!regionalProvince" class="w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors" [style.opacity]="regionalProvince ? '1' : '0.5'" style="background: var(--bg-primary); color: var(--text-primary); border-color: var(--border-color)">
                                  <option value="">-- All Counties in Province --</option>
                                  <option *ngFor="let c of regionalAvailableCounties" [value]="c.id">{{ c.name }}</option>
                               </select>
                               
                               <select [(ngModel)]="regionalConstituency" [disabled]="!regionalCounty" class="w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors" [style.opacity]="regionalCounty ? '1' : '0.5'" style="background: var(--bg-primary); color: var(--text-primary); border-color: var(--border-color)">
                                  <option value="">-- All Constituencies --</option>
                                  <option *ngFor="let c of regionalAvailableConstituencies" [value]="c.id">{{ c.name }}</option>
                               </select>
                            </div>
                         </div>
                         <button (click)="downloadRegionalReport()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors">Download PDF</button>
                      </div>
                   </div>
                </div>
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

  activeTab: 'voters' | 'candidates' | 'votes' | 'leaders' | 'reports' = 'voters';
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

  voterPage = 1;
  candidatePage = 1;
  itemsPerPage = 100;
  
  regionalProvince = '';
  regionalCounty = '';
  regionalConstituency = '';
  regionalProvinces = Object.keys(PROVINCES);
  regionalAvailableCounties: { id: number; name: string }[] = [];
  regionalAvailableConstituencies: { id: number; name: string; countyId: number }[] = [];

  get paginatedVoters() {
    return this.voters.slice((this.voterPage - 1) * this.itemsPerPage, this.voterPage * this.itemsPerPage);
  }

  get totalVoterPages() {
    return Math.ceil(this.voters.length / this.itemsPerPage);
  }

  get paginatedCandidates() {
    return this.filteredCandidates.slice((this.candidatePage - 1) * this.itemsPerPage, this.candidatePage * this.itemsPerPage);
  }

  get totalCandidatePages() {
    return Math.ceil(this.filteredCandidates.length / this.itemsPerPage);
  }

  get filteredCandidates() {
    return this.candidates.filter(c => {
      const matchSearch = c.full_name.toLowerCase().includes(this.searchQuery.toLowerCase()) || (c.party && c.party.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchSeat = this.seatFilter ? c.seat_type === this.seatFilter : true;
      return matchSearch && matchSeat;
    });
  }

  get filteredLeaders() {
    return this.leaders.filter(l => {
      if (!this.leaderSeatFilter) return true;
      return l.seat_type === this.leaderSeatFilter;
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
    // We intentionally DO NOT check localStorage here.
    // The user MUST enter the master key every time they navigate to this portal.
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  login() {
    /* 
      Admin Authentication: 
      Uses the master IEBC access key to grant root privileges.
      Token is stored in localStorage for session persistence.
    */
    if (!this.adminKey.trim()) return;
    this.loading = true;
    this.errorMsg = '';

    this.api.adminLogin(this.adminKey).subscribe({
      next: (res) => {
        this.token = res.token;
        // Token is kept in memory only, not in localStorage.
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
    this.router.navigate(['/dashboard']);
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  startPolling() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
       this.loadStats();
       this.loadTabData();
    }, 10000);
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
  downloadReport(reportName: string) {
    const url = `http://127.0.0.1:8000/system-admin/reports/${reportName}`;
    window.open(url, '_blank');
  }

  onRegionalProvinceChange() {
    this.regionalCounty = '';
    this.regionalConstituency = '';
    if (this.regionalProvince && PROVINCES[this.regionalProvince]) {
      this.regionalAvailableCounties = PROVINCES[this.regionalProvince].counties.map(id => ({
        id, name: COUNTY_NAMES[id] || `County ${id}`
      }));
    } else {
      this.regionalAvailableCounties = [];
    }
    this.regionalAvailableConstituencies = [];
  }

  onRegionalCountyChange() {
    this.regionalConstituency = '';
    if (this.regionalCounty) {
      this.regionalAvailableConstituencies = CONSTITUENCIES.filter(c => c.countyId.toString() === this.regionalCounty.toString());
    } else {
      this.regionalAvailableConstituencies = [];
    }
  }

  downloadRegionalReport() {
    let url = `http://127.0.0.1:8000/system-admin/reports/regional-analysis`;
    let params = [];
    if (this.regionalConstituency) params.push(`constituency=${this.regionalConstituency}`);
    else if (this.regionalCounty) params.push(`county=${this.regionalCounty}`);
    else if (this.regionalProvince) params.push(`province=${this.regionalProvince}`);
    
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    window.open(url, '_blank');
  }

}

// trigger recompile

// force recompile
