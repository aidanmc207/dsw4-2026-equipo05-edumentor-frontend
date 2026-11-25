import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SelectorIdiomaComponent } from './components/selector-idioma/selector-idioma.component';

@Component({
  imports: [RouterOutlet, SelectorIdiomaComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
