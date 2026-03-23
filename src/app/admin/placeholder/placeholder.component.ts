import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div class="placeholder-container">
      <h2>Página em Construção</h2>
      <p>Esta funcionalidade estará disponível em breve.</p>
      <button (click)="goBack()">Voltar ao Dashboard</button>
    </div>
  `,
  styles: [`
    .placeholder-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 70vh;
      text-align: center;
      color: #333;
    }
    h2 { font-size: 2rem; margin-bottom: 1rem; }
    p { font-size: 1.2rem; color: #666; margin-bottom: 2rem; }
    button {
      padding: 0.8rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover { background-color: #0056b3; }
  `]
})
export class PlaceholderComponent {
  goBack() {
    window.history.back();
  }
}
