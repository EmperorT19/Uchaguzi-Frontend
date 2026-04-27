import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HelpAssistantComponent } from './components/help-assistant/help-assistant';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HelpAssistantComponent, ThemeToggleComponent],
  templateUrl: './app.html',
  styles: []
})
export class AppComponent {
  title = 'voting';
}