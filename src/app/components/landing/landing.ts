import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-black via-red-900 to-green-900 flex items-center justify-center p-6">
      <div class="max-w-5xl w-full">
        <div class="text-center mb-16">
          <div class="text-9xl mb-8">🛡️</div>
          <h1 class="text-7xl font-bold text-white mb-4">Uchaguzi wa Taifa</h1>
          <p class="text-3xl text-gray-300">National Voting Portal</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Login Card -->
          <div class="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border-2 border-green-600 hover:scale-105 transition-all cursor-pointer"
               (click)="goToLogin()">
            <div class="text-6xl text-center mb-6">🔑</div>
            <h2 class="text-3xl font-bold text-white mb-6 text-center">Login</h2>
            <p class="text-gray-400 text-center mb-6">Already registered? Sign in to vote</p>
            <button class="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-xl rounded-lg hover:from-green-700 hover:to-green-800">
              Login Now
            </button>
          </div>
          
          <!-- Register Card -->
          <div class="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border-2 border-red-600 hover:scale-105 transition-all cursor-pointer"
               (click)="goToRegister()">
            <div class="text-6xl text-center mb-6">👥</div>
            <h2 class="text-3xl font-bold text-white mb-6 text-center">Register</h2>
            <p class="text-gray-400 text-center mb-6">New voter? Get your unique voter code</p>
            <button class="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xl rounded-lg hover:from-red-700 hover:to-red-800">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}