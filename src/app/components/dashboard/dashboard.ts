import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Mock data - This will be replaced by login data from session storage
const MOCK_USER = {
  full_name: "John Doe",
  voter_code: "KE-2024-001234",
  county: "Nairobi",
  constituency: "Westlands",
  ward: "Parklands",
  has_voted: {
    president: false,
    governor: false,
    senator: false,
    mp: false,
    woman_rep: false,
    mca: false
  }
};

const MOCK_SEATS = [
  { id: 1, seat_type: 'president', name: 'President', level: 'National', icon: '🇰🇪' },
  { id: 2, seat_type: 'governor', name: 'Governor', level: 'County', icon: '🏛️' },
  { id: 3, seat_type: 'senator', name: 'Senator', level: 'County', icon: '⚖️' },
  { id: 4, seat_type: 'mp', name: 'Member of Parliament', level: 'Constituency', icon: '📋' },
  { id: 5, seat_type: 'woman_rep', name: 'Woman Representative', level: 'County', icon: '👩' },
  { id: 6, seat_type: 'mca', name: 'Member of County Assembly', level: 'Ward', icon: '🏘️' }
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <!-- Navigation -->
      <div class="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div class="container mx-auto px-8 py-4">
          <div class="flex justify-between items-center">
            <div class="flex gap-4">
              <button (click)="goTo('/dashboard')" 
                      class="px-8 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-black via-red-700 to-green-700 text-white shadow-lg border border-white/20">
                Dashboard
              </button>
              <button (click)="goTo('/voting')" 
                      class="px-8 py-3 rounded-xl font-semibold transition-all bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10">
                Vote
              </button>
              <button (click)="goTo('/results')" 
                      class="px-8 py-3 rounded-xl font-semibold transition-all bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10">
                Results
              </button>
            </div>
            <button (click)="logout()" class="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg">
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="min-h-screen p-8">
        <div class="max-w-7xl mx-auto">
          <!-- User Info -->
          <div class="mb-8 bg-gradient-to-r from-black/60 via-red-900/20 to-green-900/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <p class="text-sm text-gray-400 mb-1 uppercase tracking-wider">Welcome Back</p>
            <h1 class="text-6xl font-bold bg-gradient-to-r from-red-600 via-black to-green-600 bg-clip-text text-transparent uppercase">
              {{currentUser?.full_name}}
            </h1>
            <div class="mt-4 space-y-2">
              <p class="text-gray-300">
                Voter Code: <span class="text-green-400 font-mono font-bold">{{currentUser?.voter_code}}</span>
              </p>
              <p class="text-gray-300">
                County: <span class="text-white font-semibold">{{currentUser?.county}}</span>
              </p>
              <p class="text-gray-300">
                Constituency: <span class="text-white font-semibold">{{currentUser?.constituency}}</span>
              </p>
              <p class="text-gray-300">
                Ward: <span class="text-white font-semibold">{{currentUser?.ward}}</span>
              </p>
            </div>
          </div>

          <!-- Real-Time Stats -->
          <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-green-400 text-sm uppercase tracking-wider">Total Votes Cast</span>
                <span class="text-2xl">📊</span>
              </div>
              <div class="text-4xl font-bold text-white">{{liveStats.totalVotes | number}}</div>
              <div class="text-green-400 text-xs mt-2">+{{liveStats.recentVotes}} in last minute</div>
            </div>

            <div class="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-blue-400 text-sm uppercase tracking-wider">Registered Voters</span>
                <span class="text-2xl">👥</span>
              </div>
              <div class="text-4xl font-bold text-white">{{liveStats.registeredVoters | number}}</div>
              <div class="text-blue-400 text-xs mt-2">Active voters</div>
            </div>

            <div class="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-purple-400 text-sm uppercase tracking-wider">Turnout</span>
                <span class="text-2xl">📈</span>
              </div>
              <div class="text-4xl font-bold text-white">{{liveStats.turnout}}%</div>
              <div class="text-purple-400 text-xs mt-2">{{liveStats.trend > 0 ? '+' : ''}}{{liveStats.trend}}% from avg</div>
            </div>

            <div class="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-orange-400 text-sm uppercase tracking-wider">Votes/Minute</span>
                <span class="text-2xl">⚡</span>
              </div>
              <div class="text-4xl font-bold text-white">{{liveStats.votesPerMinute}}</div>
              <div class="text-orange-400 text-xs mt-2 flex items-center gap-1">
                <span class="animate-pulse">🔴</span> Live
              </div>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="grid lg:grid-cols-2 gap-6 mb-8">
            <!-- Pie Chart -->
            <div class="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🎯</span> Voting Progress by Category
              </h3>
              <div class="flex items-center justify-center">
                <svg viewBox="0 0 200 200" class="w-64 h-64">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#1f2937" stroke-width="40"/>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" stroke-width="40"
                          [attr.stroke-dasharray]="pieChart.voted + ' ' + (pieChart.total - pieChart.voted)"
                          transform="rotate(-90 100 100)" class="transition-all duration-500"/>
                  <text x="100" y="95" text-anchor="middle" class="text-3xl font-bold fill-white">
                    {{votingProgress}}%
                  </text>
                  <text x="100" y="115" text-anchor="middle" class="text-xs fill-gray-400">
                    Complete
                  </text>
                </svg>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-400">{{votedCount}}</div>
                  <div class="text-xs text-gray-400">Voted</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-400">{{notVotedCount}}</div>
                  <div class="text-xs text-gray-400">Pending</div>
                </div>
              </div>
            </div>

            <!-- Bar Chart -->
            <div class="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📊</span> Hourly Voting Activity
              </h3>
              <div class="space-y-3">
                <div *ngFor="let hour of hourlyData" class="flex items-center gap-3">
                  <span class="text-xs text-gray-400 w-12">{{hour.time}}</span>
                  <div class="flex-1 bg-gray-800 rounded-full h-8 overflow-hidden">
                    <div [style.width.%]="hour.percentage" 
                         [ngClass]="{
                           'bg-gradient-to-r from-green-500 to-green-600': hour.percentage > 70,
                           'bg-gradient-to-r from-blue-500 to-blue-600': hour.percentage > 40 && hour.percentage <= 70,
                           'bg-gradient-to-r from-gray-500 to-gray-600': hour.percentage <= 40
                         }"
                         class="h-full transition-all duration-500 flex items-center justify-end pr-2">
                      <span class="text-xs text-white font-bold">{{hour.votes}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Line Graph -->
          <div class="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📈</span> Real-Time Voting Trend (Last 24 Hours)
            </h3>
            <div class="relative h-64">
              <svg viewBox="0 0 800 200" class="w-full h-full">
                <!-- Grid lines -->
                <line x1="0" y1="50" x2="800" y2="50" stroke="#374151" stroke-width="1" opacity="0.3"/>
                <line x1="0" y1="100" x2="800" y2="100" stroke="#374151" stroke-width="1" opacity="0.3"/>
                <line x1="0" y1="150" x2="800" y2="150" stroke="#374151" stroke-width="1" opacity="0.3"/>
                
                <!-- Line path -->
                <polyline [attr.points]="lineGraphPoints" 
                          fill="none" 
                          stroke="url(#lineGradient)" 
                          stroke-width="3"
                          class="transition-all duration-300"/>
                
                <!-- Area fill -->
                <polygon [attr.points]="lineGraphAreaPoints"
                         fill="url(#areaGradient)"
                         opacity="0.3"/>
                
                <!-- Gradients -->
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#10b981;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.5" />
                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
                <span>-24h</span>
                <span>-12h</span>
                <span>Now</span>
              </div>
            </div>
          </div>

          <!-- Voting Cards -->
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🗳️</span> Your Voting Status
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let seat of seats" 
                 [ngClass]="{
                   'bg-gradient-to-br from-green-600/90 to-green-800/90 border-green-400/30': currentUser?.has_voted[seat.seat_type],
                   'bg-gradient-to-br from-gray-800/90 to-black/90 border-white/20': !currentUser?.has_voted[seat.seat_type]
                 }"
                 class="rounded-3xl p-8 border-2 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm shadow-xl">
              <div class="flex items-center justify-between mb-4">
                <span class="text-5xl">{{seat.icon}}</span>
                <span class="text-4xl">{{currentUser?.has_voted[seat.seat_type] ? '✅' : '⏳'}}</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">{{seat.name}}</h3>
              <p class="text-white/70 text-sm mb-4">{{seat.level}} Level</p>
              
              <button *ngIf="!currentUser?.has_voted[seat.seat_type]" 
                      (click)="startVoting(seat)"
                      class="w-full py-3 bg-gradient-to-r from-red-700 via-black to-green-700 hover:from-red-600 hover:via-gray-900 hover:to-green-600 text-white font-bold rounded-lg shadow-xl transition-all border border-white/30">
                Vote Now
              </button>
              
              <div *ngIf="currentUser?.has_voted[seat.seat_type]" class="text-green-200 text-sm font-bold flex items-center gap-2">
                <span class="text-xl">✓</span> Voted Successfully
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  seats: any[] = [];
  private USE_BACKEND = false;
  private interval: any;

  // Real-time stats
  liveStats = {
    totalVotes: 245678,
    recentVotes: 0,
    registeredVoters: 450000,
    turnout: 54.6,
    trend: 2.3,
    votesPerMinute: 142
  };

  // Hourly data
  hourlyData = [
    { time: '08:00', votes: 1245, percentage: 45 },
    { time: '09:00', votes: 2156, percentage: 78 },
    { time: '10:00', votes: 1876, percentage: 68 },
    { time: '11:00', votes: 2543, percentage: 92 },
    { time: '12:00', votes: 1123, percentage: 41 }
  ];

  // Line graph data
  trendData = [120, 135, 128, 145, 158, 142, 165, 178, 172, 185];
  lineGraphPoints = '';
  lineGraphAreaPoints = '';

  votingProgress = 0;
  votedCount = 0;
  notVotedCount = 0;
  pieChart = { voted: 0, total: 502 };

  constructor(private router: Router) {}

  ngOnInit() {
    // Try to get user from session storage first
    const storedUser = sessionStorage.getItem('currentUser');
    
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    } else if (this.USE_BACKEND) {
      // Backend integration
    } else {
      // Use mock data if no session data
      this.currentUser = MOCK_USER;
      sessionStorage.setItem('currentUser', JSON.stringify(MOCK_USER));
    }
    
    this.seats = MOCK_SEATS;
    this.calculateProgress();
    this.updateLineGraph();
    this.startLiveUpdates();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  calculateProgress() {
    const voted = Object.values(this.currentUser.has_voted).filter(v => v).length;
    const total = Object.values(this.currentUser.has_voted).length;
    this.votedCount = voted;
    this.notVotedCount = total - voted;
    this.votingProgress = Math.round((voted / total) * 100);
    
    const circumference = 2 * Math.PI * 80;
    this.pieChart.voted = (voted / total) * circumference;
    this.pieChart.total = circumference;
  }

  updateLineGraph() {
    const width = 800;
    const height = 200;
    const padding = 20;
    const max = Math.max(...this.trendData);
    
    const points = this.trendData.map((val, i) => {
      const x = (i / (this.trendData.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((val / max) * (height - 2 * padding) + padding);
      return `${x},${y}`;
    }).join(' ');
    
    this.lineGraphPoints = points;
    this.lineGraphAreaPoints = `${padding},${height} ${points} ${width - padding},${height}`;
  }

  startLiveUpdates() {
    this.interval = setInterval(() => {
      // Simulate live updates
      this.liveStats.totalVotes += Math.floor(Math.random() * 10) + 5;
      this.liveStats.recentVotes = Math.floor(Math.random() * 20) + 10;
      this.liveStats.votesPerMinute = Math.floor(Math.random() * 50) + 120;
      this.liveStats.turnout = +(this.liveStats.totalVotes / this.liveStats.registeredVoters * 100).toFixed(1);
      
      // Update trend data
      this.trendData.shift();
      this.trendData.push(this.liveStats.votesPerMinute);
      this.updateLineGraph();
    }, 2000);
  }

  startVoting(seat: any) {
    // Store selected seat
    sessionStorage.setItem('selectedSeat', JSON.stringify(seat));
    
    // IMPORTANT: This will only work if you have a VotingComponent
    // If you don't have one yet, comment out the line below
    this.router.navigate(['/voting']);
    
    // If routing fails, it means:
    // 1. You don't have a VotingComponent created yet
    // 2. Or your routes are protected by an AuthGuard
    // 3. Or the route isn't registered in app.routes.ts
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    sessionStorage.clear();
    if (this.USE_BACKEND) {
      // Backend logout
    }
    this.router.navigate(['/']);
  }
}