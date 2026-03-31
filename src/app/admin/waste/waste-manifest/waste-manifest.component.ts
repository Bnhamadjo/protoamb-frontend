import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WasteService, WasteRecord } from '../../../services/waste.service';

@Component({
  standalone: true,
  selector: 'app-waste-manifest',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="manifest-wrapper p-8 bg-gray-100 min-h-screen no-print-bg">
      <div class="actions mb-6 no-print flex gap-4 justify-center">
        <button (click)="print()" class="btn primary">🖨️ Imprimir Manifesto</button>
        <a routerLink="/admin/waste" class="btn">Voltar</a>
      </div>

      <div class="manifest-card bg-white mx-auto shadow-2xl p-12 max-w-4xl border-t-8 border-green-600 print:shadow-none print:border-green-600 print:m-0" id="print-area">
        <header class="flex justify-between items-center border-bottom pb-8 mb-8">
          <div class="gov-info">
            <h2 class="text-xl font-bold uppercase tracking-widest text-green-800">República da Guiné-Bissau</h2>
            <p class="text-sm font-semibold">MINISTÉRIO DO AMBIENTE E BIODIVERSIDADE</p>
            <p class="text-xs muted">Direção Geral do Ambiente</p>
          </div>
          <div class="manifest-id text-right">
            <div class="text-sm uppercase muted font-bold">Manifesto de Transporte</div>
            <div class="text-2xl font-black text-green-700">{{ record?.manifest_token || 'PENDENTE' }}</div>
          </div>
        </header>

        <main class="space-y-10">
          <section>
            <h4 class="section-title">1. Identificação do Resíduo</h4>
            <div class="grid grid-cols-2 gap-y-4 text-sm mt-4">
              <div><strong>Categoria:</strong> {{ record?.category }}</div>
              <div><strong>Data de Produção:</strong> {{ record?.production_date | date:'dd/MM/yyyy' }}</div>
              <div><strong>Quantidade:</strong> {{ record?.quantity }} {{ record?.unit }}</div>
              <div><strong>Origem / Local:</strong> {{ record?.origin || 'Instalações MAB' }}</div>
            </div>
          </section>

          <section>
            <h4 class="section-title">2. Identificação do Transportador</h4>
            <div class="grid grid-cols-2 gap-y-4 text-sm mt-4" *ngIf="record?.transporter; else noTransporter">
              <div><strong>Empresa / Nome:</strong> {{ record?.transporter?.name }}</div>
              <div><strong>Nº Licença:</strong> {{ record?.transporter?.license_number || 'N/A' }}</div>
              <div><strong>Matrícula:</strong> {{ record?.transporter?.vehicle_plate || 'N/A' }}</div>
              <div><strong>Contacto:</strong> {{ record?.transporter?.contact || 'N/A' }}</div>
            </div>
            <ng-template #noTransporter>
              <p class="text-red-500 font-bold mt-2 italic">Aguardando atribuição de transporte oficial.</p>
            </ng-template>
          </section>

          <section>
            <h4 class="section-title">3. Notas e Observações</h4>
            <p class="text-sm italic mt-2 p-4 bg-gray-50 border rounded min-h-[60px]">
              {{ record?.notes || 'Sem observações adicionais para este transporte.' }}
            </p>
          </section>

          <div class="declaracao mt-16 pt-10 border-t flex justify-between gap-10">
            <div class="signature flex-1 text-center">
              <div class="h-16 border-b border-dashed mb-2"></div>
              <p class="text-xs font-bold uppercase">Entidade Produtora (MAB)</p>
            </div>
            <div class="signature flex-1 text-center">
              <div class="h-16 border-b border-dashed mb-2"></div>
              <p class="text-xs font-bold uppercase">Transportador Autorizado</p>
            </div>
            <div class="signature flex-1 text-center">
              <div class="h-16 border-b border-dashed mb-2"></div>
              <p class="text-xs font-bold uppercase">Entidade Destinatária</p>
            </div>
          </div>
        </main>

        <footer class="mt-20 pt-10 border-t flex justify-between items-end grayscale opacity-50">
          <div class="qr-placeholder w-24 h-24 border flex items-center justify-center text-[8px] text-center p-2">
            Verificação Digital SIRE v1.0
          </div>
          <div class="text-right text-[10px]">
            <p>Gerado em: {{ now | date:'dd/MM/yyyy HH:mm' }}</p>
            <p>Este documento é oficial e serve como comprovativo de transporte legal de resíduos na Guiné-Bissau.</p>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .manifest-card { font-family: 'Inter', sans-serif; }
    .section-title { font-size: 0.75rem; font-weight: 800; color: #166534; border-bottom: 2px solid #dcfce7; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .signature { min-width: 150px; }
    
    @media print {
      .no-print { display: none !important; }
      .manifest-wrapper { padding: 0 !important; background: white !important; }
      .manifest-card { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; border: 1px solid #eee !important; border-top: 8px solid #166534 !important; }
      body { background: white !important; }
    }
  `]
})
export class WasteManifestComponent implements OnInit {
  record: WasteRecord | null = null;
  now = new Date();

  constructor(private wasteService: WasteService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.wasteService.show(+id).subscribe({
        next: (res) => this.record = res
      });
    }
  }

  print(): void {
    window.print();
  }
}
