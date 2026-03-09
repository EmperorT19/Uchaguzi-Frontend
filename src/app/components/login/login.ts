// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { VotingService } from '../../services/voting';
// import { AuthService } from '../../services/auth';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="min-h-screen bg-gradient-to-br from-black via-red-900 to-green-900 flex items-center justify-center p-6">
//       <div *ngIf="loading" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50">
//         <div class="text-center">
//           <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
//           <p class="text-white text-xl">Logging in...</p>
//         </div>
//       </div>

//       <div class="max-w-md w-full">
//         <button (click)="goBack()" class="mb-6 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
//           ← Back to Home
//         </button>

//         <div class="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border-2 border-green-600">
//           <div class="text-6xl text-center mb-6">🔑</div>
//           <h2 class="text-3xl font-bold text-white mb-6 text-center">Voter Login</h2>
          
//           <div class="space-y-4">
//             <input 
//               [(ngModel)]="voterCode" 
//               (input)="voterCode = voterCode.toUpperCase()"
//               class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-green-600" 
//               placeholder="Voter Code (e.g., KVXXX)"/>
            
//             <input 
//               [(ngModel)]="idNumber" 
//               (input)="filterNumbers()"
//               class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-green-600" 
//               placeholder="ID Number" 
//               maxlength="8"/>
            
//             <button 
//               (click)="login()" 
//               class="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-xl rounded-lg hover:from-green-700 hover:to-green-800">
//               Login
//             </button>
//           </div>

//           <div class="mt-6 text-center">
//             <p class="text-gray-400 mb-2">Don't have an account?</p>
//             <button (click)="goToRegister()" class="text-red-400 hover:text-red-300 font-bold">
//               Register Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: []
// })
// export class LoginComponent {
//   voterCode = '';
//   idNumber = '';
//   loading = false;

//   constructor(
//     private votingService: VotingService,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   filterNumbers() {
//     this.idNumber = this.idNumber.replace(/\D/g, '').slice(0, 8);
//   }

//   login() {
//     if (!this.voterCode || !this.idNumber) {
//       alert('Please fill in both fields');
//       return;
//     }
    
//     this.loading = true;
    
//     this.votingService.loginVoter(this.voterCode, this.idNumber).subscribe({
//       next: (response) => {
//         this.loading = false;
//         this.authService.setCurrentUser(response);
//         this.router.navigate(['/dashboard']);
//       },
//       error: (err) => {
//         this.loading = false;
//         alert('Invalid credentials. Please check your voter code and ID number.');
//       }
//     });
//   }

//   goToRegister() {
//     this.router.navigate(['/register']);
//   }

//   goBack() {
//     this.router.navigate(['/']);
//   }
// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService, Voter } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-black via-red-900 to-green-900 flex items-center justify-center p-6">
      <!-- Loading overlay -->
      <div *ngIf="loading" class="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p class="text-white text-xl">Logging in...</p>
        </div>
      </div>

      <div class="max-w-md w-full">
        <button (click)="goBack()" class="mb-6 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
          ← Back to Home
        </button>

        <div class="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border-2 border-green-600">
          <div class="text-6xl text-center mb-6">🔑</div>
          <h2 class="text-3xl font-bold text-white mb-8 text-center">Voter Login</h2>

          <div class="space-y-4">
            <!-- ID Number -->
            <div>
              <label class="block text-white font-bold mb-2">ID Number</label>
              <input
                [(ngModel)]="idNumber"
                (input)="filterNumbers()"
                class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-green-600"
                placeholder="12345678"
                maxlength="8" />
            </div>

            <!-- Voter Code -->
            <div>
              <label class="block text-white font-bold mb-2">Voter Code</label>
              <input
                [(ngModel)]="voterCode"
                class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-green-600 font-mono"
                placeholder="Sent to your email" />
            </div>

            <!-- Error -->
            <p *ngIf="errorMsg" class="text-red-400 text-sm">{{ errorMsg }}</p>

            <button
              (click)="login()"
              [disabled]="loading"
              class="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl rounded-lg disabled:opacity-50">
              Login
            </button>
          </div>

          <div class="mt-6 text-center">
            <p class="text-gray-400 mb-2">Don't have an account?</p>
            <button (click)="goToRegister()" class="text-red-400 hover:text-red-300 font-bold">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  idNumber = '';
  voterCode = '';
  loading = false;
  errorMsg = '';

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  filterNumbers() {
    this.idNumber = this.idNumber.replace(/\D/g, '').slice(0, 8);
  }

  login() {
    this.errorMsg = '';

    if (!this.idNumber || !this.voterCode) {
      this.errorMsg = 'Please fill in both fields.';
      return;
    }

    this.loading = true;

    this.api.login({ id_number: this.idNumber, voter_code: this.voterCode.trim() }).subscribe({
      next: (res) => {
        this.loading = false;
        const hasVotedArray: string[] = res.user.has_voted || [];
        const user: Voter = {
          ...res.user,
          has_voted: Object.fromEntries(hasVotedArray.map((s: string) => [s, true]))
        };
        this.authService.setCurrentUser(user);
        this.router.navigate(['/dashboard']);
      },
      error: (err: { error: { detail: any; error: any; }; }) => {
        this.loading = false;
        this.errorMsg = err.error?.detail || err.error?.error || 'Invalid credentials. Please try again.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}