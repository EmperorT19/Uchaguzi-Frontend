// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-voting',
//   imports: [],
//   templateUrl: './voting.html',
//   styleUrl: './voting.css',
// })
// export class Voting {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface County {
  voters: number;
  constituencies: { [key: string]: string[] };
}

interface User {
  fullName: string;
  idNumber: string;
  county: string;
  constituency: string;
  ward: string;
  phone: string;
  voterCode: string;
  hasVoted: {
    presidential: boolean;
    gubernatorial: boolean;
    senatorial: boolean;
    womenRep: boolean;
    mp: boolean;
    mca: boolean;
  };
  registeredAt: string;
}

interface Candidate {
  name: string;
  party: string;
  num: number;
}

@Component({
  selector: 'app-voting',
  imports: [CommonModule, FormsModule],
  templateUrl: './voting.html',
  styleUrl: './voting.css'
})
export class Voting implements OnInit {
  page = 'landing';
  modal: string | null = null;

  form = {
    fullName: '',
    idNumber: '',
    county: '',
    constituency: '',
    ward: '',
    phone: '+254'
  };

  loginForm = {
    voterCode: '',
    idNumber: ''
  };

  errors: any = {};
  currentUser: User | null = null;
  votingFor = 'presidential';
  selectedCandidates: any = {};
  votes: any = {};
  registeredUsers: { [key: string]: User } = {};

  COUNTIES_DATA: { [key: string]: County } = {
    Nairobi: {
      voters: 2450000,
      constituencies: {
        Westlands: ['Kitisuru', 'Parklands/Highridge', 'Karura', 'Kangemi', 'Mountain View'],
        Langata: ['Karen', 'Nairobi West', 'Mugumo-ini', 'South C', 'Nyayo Highrise']
      }
    },
    Mombasa: {
      voters: 650000,
      constituencies: {
        Changamwe: ['Port Reitz', 'Kipevu', 'Airport', 'Changamwe', 'Chaani'],
        Mvita: ['Mji Wa Kale/Makadara', 'Tudor', 'Tononoka', 'Shimanzi/Ganjoni', 'Majengo']
      }
    }
  };

  seats = [
    { id: 'presidential', name: 'President', level: 'National', icon: '🇰🇪' },
    { id: 'gubernatorial', name: 'Governor', level: 'County', icon: '🏛️' },
    { id: 'senatorial', name: 'Senator', level: 'County', icon: '⚖️' },
    { id: 'womenRep', name: 'Women Representative', level: 'County', icon: '👩' },
    { id: 'mp', name: 'Member of Parliament', level: 'Constituency', icon: '📜' },
    { id: 'mca', name: 'Member of County Assembly', level: 'Ward', icon: '🏘️' }
  ];

  candidates: any = {
    presidential: [
      { name: 'Dr. Jane Wanjiku Mwangi', party: 'National Unity Alliance', num: 1 },
      { name: 'Hon. David Kipchoge Korir', party: 'Progressive Democratic Party', num: 2 },
      { name: 'Prof. Grace Akinyi Otieno', party: "People's Voice Movement", num: 3 }
    ],
    gubernatorial: [
      { name: 'John Kamau', party: 'Party A', num: 1 },
      { name: 'Mary Njeri', party: 'Party B', num: 2 }
    ],
    senatorial: [
      { name: 'Peter Ochieng', party: 'Party C', num: 1 },
      { name: 'Sarah Wambui', party: 'Party D', num: 2 }
    ],
    womenRep: [
      { name: 'Faith Muthoni', party: 'Party E', num: 1 },
      { name: 'Lucy Akinyi', party: 'Party F', num: 2 }
    ],
    mp: [
      { name: 'James Kiplagat', party: 'Party G', num: 1 },
      { name: 'Rose Chebet', party: 'Party H', num: 2 }
    ],
    mca: [
      { name: 'David Mutua', party: 'Party I', num: 1 },
      { name: 'Jane Wanjiru', party: 'Party J', num: 2 }
    ]
  };

  ngOnInit() {
    const savedUsers = localStorage.getItem('voting_users');
    const savedVotes = localStorage.getItem('voting_votes');

    if (savedUsers) this.registeredUsers = JSON.parse(savedUsers);
    if (savedVotes) this.votes = JSON.parse(savedVotes);
  }

  getCounties() {
    return Object.keys(this.COUNTIES_DATA);
  }

  getConstituencies() {
    if (!this.form.county) return [];
    return Object.keys(this.COUNTIES_DATA[this.form.county].constituencies);
  }

  getWards() {
    if (!this.form.constituency) return [];
    return this.COUNTIES_DATA[this.form.county].constituencies[this.form.constituency];
  }

  onCountyChange() {
    this.form.constituency = '';
    this.form.ward = '';
  }

  onConstituencyChange() {
    this.form.ward = '';
  }

  handleInput(field: string, event: any) {
    const value = event.target.value;

    if (field === 'fullName') {
      this.form.fullName = value.replace(/[^A-Za-z\s]/g, '');
      this.errors.fullName = '';
    }

    if (field === 'idNumber') {
      this.form.idNumber = value.replace(/\D/g, '').slice(0, 8);
      this.errors.idNumber = '';
    }

    if (field === 'phone') {
      this.form.phone = '+254' + value.slice(4).replace(/\D/g, '').slice(0, 9);
      this.errors.phone = '';
    }
  }

  filterIdNumber(event: any) {
    this.loginForm.idNumber = event.target.value.replace(/\D/g, '').slice(0, 8);
  }

  validate() {
    this.errors = {};

    if (!this.form.fullName.trim()) this.errors.fullName = 'Required';
    if (!this.form.idNumber.trim()) this.errors.idNumber = 'Required';
    if (!this.form.county) this.errors.county = 'Required';
    if (!this.form.constituency) this.errors.constituency = 'Required';
    if (!this.form.ward) this.errors.ward = 'Required';
    if (!/^\+254\d{9}$/.test(this.form.phone)) this.errors.phone = 'Invalid format';

    return Object.keys(this.errors).length === 0;
  }

  register() {
    if (!this.validate()) return;

    if (this.registeredUsers[this.form.idNumber]) {
      this.modal = 'already-registered';
      return;
    }

    const voterCode =
      'KV' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 5).toUpperCase();

    const newUser: User = {
      ...this.form,
      voterCode,
      hasVoted: {
        presidential: false,
        gubernatorial: false,
        senatorial: false,
        womenRep: false,
        mp: false,
        mca: false
      },
      registeredAt: new Date().toISOString()
    };

    this.registeredUsers[this.form.idNumber] = newUser;
    this.currentUser = newUser;

    localStorage.setItem('voting_users', JSON.stringify(this.registeredUsers));
    this.modal = 'show-voter-code';
  }

  login() {
    const user = this.registeredUsers[this.loginForm.idNumber];
    if (user && user.voterCode === this.loginForm.voterCode) {
      this.currentUser = user;
      this.page = 'dashboard';
      this.loginForm = { voterCode: '', idNumber: '' };
    } else {
      this.modal = 'not-registered-login';
    }
  }

  logout() {
    this.currentUser = null;
    this.page = 'landing';
  }

  startVoting(seatId: string) {
    this.votingFor = seatId;
    this.page = 'voting';
  }

  getCandidates(seatId: string): Candidate[] {
    return this.candidates[seatId] || [];
  }

  selectCandidate(candidate: Candidate) {
    this.selectedCandidates[this.votingFor] = candidate;
  }

  submitVote() {
    if (!this.selectedCandidates[this.votingFor]) return;
    this.modal = 'vote-confirm';
  }

  confirmVote() {
    const key = `${this.votingFor}_${this.selectedCandidates[this.votingFor].name}`;
    this.votes[key] = (this.votes[key] || 0) + 1;

    if (this.currentUser) {
      this.currentUser.hasVoted[this.votingFor as keyof User['hasVoted']] = true;
      this.registeredUsers[this.currentUser.idNumber] = this.currentUser;
      localStorage.setItem('voting_users', JSON.stringify(this.registeredUsers));
      localStorage.setItem('voting_votes', JSON.stringify(this.votes));
    }

    this.selectedCandidates[this.votingFor] = null;
    this.modal = 'vote-success';
  }

  getSeatName(seatId: string) {
    return this.seats.find(s => s.id === seatId)?.name || '';
  }

  getResults(seatId: string) {
    return this.candidates[seatId].map((c: Candidate) => ({
      ...c,
      votes: this.votes[`${seatId}_${c.name}`] || 0
    }));
  }

  getTotalVotes(seatId: string) {
    return this.getResults(seatId).reduce((sum: number, c: any) => sum + c.votes, 0);
  }

  getPercentage(votes: number, total: number) {
    return total ? Math.round((votes / total) * 100) : 0;
  }

  closeModal() { this.modal = null; }
  goToDashboard() { this.modal = null; this.page = 'dashboard'; }
  goToRegistration() { this.modal = null; this.page = 'registration'; }
  goToLanding() { this.modal = null; this.page = 'landing'; }
}