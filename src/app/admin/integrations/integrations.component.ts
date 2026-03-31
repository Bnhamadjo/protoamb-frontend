import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntegrationService, ApiToken } from '../../services/integration.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header">
        <div class="title-section">
          <h1>Integrações & API</h1>
          <p>Gerir chaves de acesso para sistemas externos e parceiros</p>
        </div>
      </header>

      <div class="grid-2">
        <!-- Token Management -->
        <div class="data-card">
          <header class="card-header">
            <h3>Chaves de API Ativas</h3>
            <p>Tokens de acesso para integração via REST API</p>
          </header>

          <div class="token-generator mb-4">
            <div class="form-group inline-form">
              <input type="text" [(ngModel)]="newTokenName" placeholder="Nome do Sistema/Parceiro (ex: Portal Municipal)">
              <button (click)="generateToken()" class="btn-primary" [disabled]="!newTokenName || loading">
                Gerar Nova Chave
              </button>
            </div>
          </div>

          <!-- New Token Display (Once) -->
          <div *ngIf="lastGeneratedToken" class="alert alert-warning mb-4 anim-up">
            <div class="alert-content">
              <strong>⚠️ Guarde esta chave agora!</strong>
              <p>Por razões de segurança, não poderá voltar a ver esta chave.</p>
              <div class="copy-box">
                <code>{{ lastGeneratedToken }}</code>
                <button (click)="copyToken(lastGeneratedToken)" class="btn-small">Copiar</button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Nome do Token</th>
                  <th>Último Uso</th>
                  <th>Criado em</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let token of tokens">
                  <td><strong>{{ token.name }}</strong></td>
                  <td>{{ token.last_used_at ? (token.last_used_at | date:'dd/MM/yyyy HH:mm') : 'Nunca usado' }}</td>
                  <td>{{ token.created_at | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <button (click)="revokeToken(token.id)" class="btn-icon btn-delete" title="Revogar">Revogar</button>
                  </td>
                </tr>
                <tr *ngIf="tokens.length === 0">
                  <td colspan="4" class="empty-state">Nenhuma chave de API gerada.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- API Documentation Quick Links -->
        <div class="data-card">
          <header class="card-header">
            <h3>Documentação Técnica</h3>
            <p>Como integrar com o Portal MAB</p>
          </header>
          
          <div class="doc-links">
            <div class="doc-item">
              <span class="method get">GET</span>
              <div class="info">
                <strong>/api/environmental-metrics</strong>
                <p>Lista dados de qualidade de ar e água em tempo real.</p>
              </div>
            </div>
            <div class="doc-item">
              <span class="method post">POST</span>
              <div class="info">
                <strong>/api/waste-records</strong>
                <p>Registo de produção de resíduos por categoria.</p>
              </div>
            </div>
            <div class="doc-item">
              <span class="method get">GET</span>
              <div class="info">
                <strong>/api/biodiversity</strong>
                <p>Exportação de dados de fauna e flora.</p>
              </div>
            </div>
          </div>

          <div class="api-help mt-4">
            <h4>Autenticação</h4>
            <p>Utilize o header <code>Authorization: Bearer [SEU_TOKEN]</code> em todos os pedidos.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid-2 { display: grid; grid-template-columns: 1fr 400px; gap: 20px; }
    .inline-form { display: flex; gap: 10px; }
    .inline-form input { flex: 1; }
    
    .copy-box { 
      background: #1e293b; color: #10b981; padding: 12px; border-radius: 8px;
      display: flex; justify-content: space-between; align-items: center; margin-top: 10px;
    }
    
    .doc-links { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
    .doc-item { display: flex; gap: 15px; align-items: flex-start; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .method { 
      font-size: 0.7rem; font-weight: bold; padding: 4px 8px; border-radius: 4px;
      min-width: 50px; text-align: center;
    }
    .method.get { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .method.post { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    
    .info strong { display: block; font-family: monospace; font-size: 0.9rem; margin-bottom: 4px; }
    .info p { font-size: 0.85rem; color: #94a3b8; margin: 0; }
    
    .api-help code { background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #e2e8f0; }

    @media (max-width: 1024px) {
      .grid-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class IntegrationsComponent implements OnInit {
  tokens: ApiToken[] = [];
  newTokenName = '';
  lastGeneratedToken: string | null = null;
  loading = false;

  constructor(
    private integrationService: IntegrationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTokens();
  }

  loadTokens(): void {
    this.integrationService.getTokens().subscribe(res => this.tokens = res);
  }

  generateToken(): void {
    if (!this.newTokenName) return;
    this.loading = true;
    this.integrationService.createToken(this.newTokenName).subscribe({
      next: (res) => {
        this.lastGeneratedToken = res.token || res.plainTextToken || null;
        this.newTokenName = '';
        this.loading = false;
        this.toast.success('Chave de API gerada com sucesso');
        this.loadTokens();
      },
      error: () => {
        this.loading = false;
        this.toast.error('Erro ao gerar chave de API');
      }
    });
  }

  revokeToken(id: number): void {
    if (confirm('Tem a certeza que deseja revogar esta chave de acesso? O sistema externo perderá o acesso imediatamente.')) {
      this.integrationService.deleteToken(id).subscribe({
        next: () => {
          this.toast.success('Chave revogada');
          this.loadTokens();
        },
        error: () => this.toast.error('Erro ao revogar chave')
      });
    }
  }

  copyToken(token: string): void {
    navigator.clipboard.writeText(token);
    this.toast.success('Chave copiada para a área de transferência');
  }
}
