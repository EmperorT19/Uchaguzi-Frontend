// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';

// interface Voter {
//   id: number;
//   full_name: string;
//   voter_code: string;
//   id_number: string;
//   county_name: string;
//   constituency_name: string;
//   ward_name: string;
//   has_voted: any;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUserSubject = new BehaviorSubject<Voter | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();

//   constructor() {
//     const savedUser = sessionStorage.getItem('currentUser');
//     if (savedUser) {
//       this.currentUserSubject.next(JSON.parse(savedUser));
//     }
//   }

//   setCurrentUser(user: Voter) {
//     sessionStorage.setItem('currentUser', JSON.stringify(user));
//     this.currentUserSubject.next(user);
//   }

//   getCurrentUser(): Voter | null {
//     return this.currentUserSubject.value;
//   }

//   updateUser(user: Voter) {
//     this.setCurrentUser(user);
//   }

//   isLoggedIn(): boolean {
//     return this.currentUserSubject.value !== null;
//   }

//   logout() {
//     sessionStorage.removeItem('currentUser');
//     this.currentUserSubject.next(null);
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Voter {
  id: number;
  full_name: string;
  voter_code: string;
  id_number: string;
  county: string;
  constituency: string;
  ward: string;
  has_voted: { [seat: string]: boolean };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Voter | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const saved = sessionStorage.getItem('currentUser');
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }

  setCurrentUser(user: Voter) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Voter | null {
    return this.currentUserSubject.value;
  }

  updateVotedStatus(seatType: string) {
    const user = this.getCurrentUser();
    if (user) {
      user.has_voted[seatType] = true;
      this.setCurrentUser(user);
    }
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}