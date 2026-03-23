import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from './header/header.component';
import { PublicFooterComponent } from './footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-public-layout',
  imports: [CommonModule, RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <div class="public-layout">
      <app-public-header></app-public-header>
      
      <main class="content-area">
        <router-outlet></router-outlet>
      </main>
      
      <app-public-footer></app-public-footer>
    </div>
  `,
  styles: [`
    .public-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #fdfdfd;
      color: var(--ink, #1a1a1a);
    }
    
    .content-area {
      flex: 1;
      animation: fadeIn 0.4s ease-out;
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class PublicLayoutComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
