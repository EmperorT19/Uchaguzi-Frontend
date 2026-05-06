import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
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
                maxlength="9" />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-white font-bold mb-2">Password</label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="voterCode"
                  class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-green-600 font-mono pr-12"
                  placeholder="Password (Voter Code if first login)" />
                <button (click)="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                </button>
              </div>
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

          <!-- Forgot Password + Register links -->
          <div class="mt-6 text-center space-y-3">
            <button (click)="showForgotModal = true" class="text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition-colors">
              🔓 Forgot Password?
            </button>
            <div>
              <p class="text-gray-400 mb-2">Don't have an account?</p>
              <button (click)="goToRegister()" class="text-red-400 hover:text-red-300 font-bold">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Change Password Modal (first login) -->
      <div *ngIf="showPasswordModal" class="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900 rounded-3xl p-8 max-w-md w-full border-2 border-green-600 shadow-2xl shadow-green-900/50">
          <h3 class="text-3xl font-bold text-white mb-2">Security Update</h3>
          <p class="text-gray-400 mb-6">Please create a strong personal password to continue.</p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-white font-bold mb-2">New Password</label>
              <div class="relative">
                <input
                  [type]="showNewPassword ? 'text' : 'password'"
                  [(ngModel)]="newPassword"
                  class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 pr-12"
                  placeholder="Must be 8-16 chars, mix of case, num & special" />
                <button (click)="showNewPassword = !showNewPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <svg *ngIf="!showNewPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <svg *ngIf="showNewPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                </button>
              </div>
              <!-- Password Requirements Feedback -->
              <div class="mt-3 text-xs font-mono space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                 <p [class.text-green-400]="newPassword.length >= 8 && newPassword.length <= 16" [class.text-gray-500]="!(newPassword.length >= 8 && newPassword.length <= 16)">
                   <span class="mr-2">{{ (newPassword.length >= 8 && newPassword.length <= 16) ? '✅' : '⚪' }}</span> 8-16 characters
                 </p>
                 <p [class.text-green-400]="hasUpperCase" [class.text-gray-500]="!hasUpperCase">
                   <span class="mr-2">{{ hasUpperCase ? '✅' : '⚪' }}</span> Uppercase letter
                 </p>
                 <p [class.text-green-400]="hasLowerCase" [class.text-gray-500]="!hasLowerCase">
                   <span class="mr-2">{{ hasLowerCase ? '✅' : '⚪' }}</span> Lowercase letter
                 </p>
                 <p [class.text-green-400]="hasNumber" [class.text-gray-500]="!hasNumber">
                   <span class="mr-2">{{ hasNumber ? '✅' : '⚪' }}</span> Number
                 </p>
                 <p [class.text-green-400]="hasSpecialChar" [class.text-gray-500]="!hasSpecialChar">
                   <span class="mr-2">{{ hasSpecialChar ? '✅' : '⚪' }}</span> Special character
                 </p>
              </div>
            </div>
            
            <div>
              <label class="block text-white font-bold mb-2">Confirm Password</label>
              <div class="relative">
                <input
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  [(ngModel)]="confirmPassword"
                  class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 pr-12"
                  placeholder="Retype password" />
                <button (click)="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <svg *ngIf="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <svg *ngIf="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                </button>
              </div>
            </div>
            
            <p *ngIf="pwdErrorMsg" class="text-red-400 text-sm">{{ pwdErrorMsg }}</p>

            <button
              (click)="changePassword()"
              [disabled]="loading"
              class="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg mt-4 disabled:opacity-50 transition-colors">
              Save Password & Continue
            </button>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div *ngIf="showForgotModal" class="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900 rounded-3xl p-8 max-w-md w-full border-2 border-yellow-600 shadow-2xl shadow-yellow-900/50">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-2xl font-bold text-white">Reset Password</h3>
              <p class="text-gray-400 text-sm mt-1">Enter your ID number and registered email to receive a temporary password.</p>
            </div>
            <button (click)="closeForgotModal()" class="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
          </div>
          
          <!-- Success state -->
          <div *ngIf="forgotSuccess" class="text-center py-6">
            <div class="text-5xl mb-4">📧</div>
            <p class="text-green-400 font-bold text-lg mb-2">Request Submitted!</p>
            <p class="text-gray-400 text-sm mb-6">{{ forgotSuccessMsg }}</p>
            <button (click)="closeForgotModal()" class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors">
              Back to Login
            </button>
          </div>

          <!-- Form state -->
          <div *ngIf="!forgotSuccess" class="space-y-4 mt-6">
            <div>
              <label class="block text-white font-bold mb-2">ID Number</label>
              <input
                [(ngModel)]="forgotIdNumber"
                (input)="filterForgotId()"
                class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                placeholder="12345678"
                maxlength="9" />
            </div>
            
            <div>
              <label class="block text-white font-bold mb-2">Registered Email</label>
              <input
                [(ngModel)]="forgotEmail"
                type="email"
                class="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                placeholder="your@email.com" />
            </div>
            
            <p *ngIf="forgotErrorMsg" class="text-red-400 text-sm">{{ forgotErrorMsg }}</p>

            <button
              (click)="submitForgotPassword()"
              [disabled]="forgotLoading"
              class="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold text-lg rounded-lg disabled:opacity-50 transition-colors">
              <span *ngIf="!forgotLoading">Send Reset Email</span>
              <span *ngIf="forgotLoading" class="flex items-center justify-center gap-2">
                <span class="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                Sending...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  idNumber = '';
  voterCode = '';
  loading = false;
  errorMsg = '';
  
  showPasswordModal = false;
  newPassword = '';
  confirmPassword = '';
  pwdErrorMsg = '';
  tempUser: any = null;
  
  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Forgot password state
  showForgotModal = false;
  forgotIdNumber = '';
  forgotEmail = '';
  forgotErrorMsg = '';
  forgotLoading = false;
  forgotSuccess = false;
  forgotSuccessMsg = '';

  get hasUpperCase() { return /[A-Z]/.test(this.newPassword); }
  get hasLowerCase() { return /[a-z]/.test(this.newPassword); }
  get hasNumber() { return /\d/.test(this.newPassword); }
  get hasSpecialChar() { return /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword); }

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // HIGH SECURITY: Proactively destroy any existing session if they visit the login page.
    this.authService.logout();
  }

  filterNumbers() {
    this.idNumber = this.idNumber.replace(/\D/g, '').slice(0, 9);
  }

  filterForgotId() {
    this.forgotIdNumber = this.forgotIdNumber.replace(/\D/g, '').slice(0, 9);
  }

  login() {
    this.errorMsg = '';

    if (!this.idNumber || !this.voterCode) {
      this.errorMsg = 'Please fill in both fields.';
      return;
    }

    this.loading = true;

    this.api.login({ id_number: this.idNumber, voter_code: this.voterCode.trim() }).subscribe({
      next: (res: any) => {
        this.loading = false;
        const hasVotedArray: string[] = res.user.has_voted || [];
        const user: Voter = {
          ...res.user,
          has_voted: Object.fromEntries(hasVotedArray.map((s: string) => [s, true]))
        };
        
        if (res.requires_password_change) {
            this.tempUser = user;
            this.showPasswordModal = true;
            this.cdr.detectChanges();
        } else {
            this.authService.setCurrentUser(user);
            this.cdr.detectChanges();
            this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error("Login Error", err);
        const errData = err.error || {};
        this.errorMsg = errData.message || errData.error || errData.detail || 'Invalid credentials or server error. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  changePassword() {
    this.pwdErrorMsg = '';
    
    if (this.newPassword !== this.confirmPassword) {
      this.pwdErrorMsg = 'Passwords do not match.';
      return;
    }
    
    if (this.newPassword.length < 8 || this.newPassword.length > 16) {
      this.pwdErrorMsg = 'Password must be between 8 and 16 characters.';
      return;
    }
    
    if (!/[A-Z]/.test(this.newPassword) || !/[a-z]/.test(this.newPassword) || !/\d/.test(this.newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword)) {
      this.pwdErrorMsg = 'Password must contain uppercase, lowercase, number, and special character.';
      return;
    }
    
    this.loading = true;
    
    this.api.changePassword({ 
        id_number: this.idNumber, 
        old_password: this.voterCode.trim(), 
        new_password: this.newPassword 
    }).subscribe({
        next: (res) => {
            this.loading = false;
            this.showPasswordModal = false;
            this.authService.setCurrentUser(this.tempUser);
            this.cdr.detectChanges();
            this.router.navigate(['/dashboard']);
        },
        error: (err) => {
            this.loading = false;
            const errData = err.error || {};
            this.pwdErrorMsg = errData.message || errData.error || 'Failed to change password.';
            this.cdr.detectChanges();
        }
    });
  }

  submitForgotPassword() {
    this.forgotErrorMsg = '';

    if (!this.forgotIdNumber || !this.forgotEmail) {
      this.forgotErrorMsg = 'Please fill in both fields.';
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.forgotEmail)) {
      this.forgotErrorMsg = 'Please enter a valid email address.';
      return;
    }

    this.forgotLoading = true;

    this.api.forgotPassword({
      id_number: this.forgotIdNumber,
      email: this.forgotEmail.trim()
    }).subscribe({
      next: (res: any) => {
        this.forgotLoading = false;
        this.forgotSuccess = true;
        this.forgotSuccessMsg = res.message || 'If the details match our records, a temporary password will be sent to your email.';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.forgotLoading = false;
        const errData = err.error || {};
        this.forgotErrorMsg = errData.message || 'Something went wrong. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  closeForgotModal() {
    this.showForgotModal = false;
    this.forgotIdNumber = '';
    this.forgotEmail = '';
    this.forgotErrorMsg = '';
    this.forgotLoading = false;
    this.forgotSuccess = false;
    this.forgotSuccessMsg = '';
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}