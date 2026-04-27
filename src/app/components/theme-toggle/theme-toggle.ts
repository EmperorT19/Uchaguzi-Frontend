import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.css']
})
export class ThemeToggleComponent implements OnInit {
  isDark = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('uchaguzi-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDark = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('uchaguzi-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('uchaguzi-theme', 'light');
    }
    
    // Dispatch a custom event so other components (like charts) can react instantly
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: this.isDark } }));
  }
}
