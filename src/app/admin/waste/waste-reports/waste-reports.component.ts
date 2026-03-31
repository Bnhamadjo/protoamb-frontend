import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteService, WasteStat, WasteRecord } from '../../../services/waste.service';

@Component({
  standalone: true,
  selector: 'app-waste-reports',
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <header class="page-header no-print">
        <div class="title-area">
          <h1>Relatórios SIRE</h1>
          <p>Dados consolidados para entidades reguladoras e monitorização interna.</p>
        </div>
        <div class="actions">
          <button (click)="print()" class="btn secondary">🖨️ Imprimir Relatório</button>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <!-- Totais por Categoria -->
        <div class="card bg-white p-6 shadow-sm border-t-4 border-blue-500">
          <h3 class="font-bold mb-4 text-gray-700">Produção por Categoria</h3>
          <div class="space-y-4">
            <div *ngFor="let s of stats">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium">{{ s.category }}</span>
                <span class="text-sm font-bold">{{ s.total | number:'1.2-2' }} kg</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" [style.width]="getPercentage(s.total) + '%'"></div>
              </div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t flex justify-between">
            <span class="font-bold uppercase text-xs muted">Total Acumulado</span>
            <span class="font-black text-xl">{{ totalQuantity | number:'1.2-2' }} kg</span>
          </div>
        </div>

        <!-- Estatísticas de Reciclagem -->
        <div class="card bg-white p-6 shadow-sm border-t-4 border-green-500">
          <h3 class="font-bold mb-4 text-gray-700">Indicadores de Sustentabilidade</h3>
          <div class="flex flex-col gap-6 justify-center h-full pb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded bg-green-100 flex items-center justify-center text-2xl">♻️</div>
              <div>
                <div class="text-2xl font-black text-green-700">{{ recyclingRate | number:'1.0-0' }}%</div>
                <div class="text-xs muted uppercase font-bold">Taxa de Reciclagem Local</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded bg-blue-100 flex items-center justify-center text-2xl">🚛</div>
              <div>
                <div class="text-2xl font-black text-blue-700">{{ transporterCount }}</div>
                <div class="text-xs muted uppercase font-bold">Operadores Autorizados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela Detalhada para Auditoria -->
      <div class="card bg-white mt-8 shadow-sm">
        <div class="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 class="font-bold text-gray-700 text-sm italic">Detalhamento de Manifestos Emitidos</h3>
        </div>
        <table class="data-table w-full text-left">
          <thead>
            <tr class="bg-gray-100 text-xs uppercase text-gray-600">
              <th class="p-4">Data</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Manifesto</th>
              <th>Transportador</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr *ngFor="let r of records" class="border-b last:border-0 hover:bg-gray-50">
              <td class="p-4">{{ r.production_date | date:'shortDate' }}</td>
              <td>{{ r.category }}</td>
              <td>{{ r.quantity }} {{ r.unit }}</td>
              <td class="font-mono text-xs">{{ r.manifest_token || '-' }}</td>
              <td>{{ r.transporter?.name || 'N/A' }}</td>
              <td>
                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase" [ngClass]="getStatusColor(r.status)">
                  {{ r.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    @media print {
      .no-print { display: none !important; }
      .admin-container { padding: 0 !important; }
      .card { box-shadow: none !important; border: 1px solid #eee !important; }
    }
  `]
})
export class WasteReportsComponent implements OnInit {
  stats: WasteStat[] = [];
  records: WasteRecord[] = [];
  totalQuantity = 0;
  recyclingRate = 0;
  transporterCount = 0;

  constructor(private wasteService: WasteService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.wasteService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.totalQuantity = res.reduce((acc, curr) => acc + Number(curr.total), 0);
        
        const recycled = res.filter(s => s.category.toLowerCase().includes('recicl'))
                           .reduce((acc, curr) => acc + Number(curr.total), 0);
        
        this.recyclingRate = this.totalQuantity > 0 ? (recycled / this.totalQuantity) * 100 : 0;
      }
    });

    this.wasteService.all().subscribe({
      next: (res) => this.records = res
    });

    this.wasteService.getTransporters().subscribe({
      next: (res) => this.transporterCount = res.length
    });
  }

  getPercentage(total: number): number {
    return this.totalQuantity > 0 ? (total / this.totalQuantity) * 100 : 0;
  }

  getStatusColor(status?: string): string {
    const s = status?.toLowerCase() || '';
    if (s.includes('recicl')) return 'bg-green-100 text-green-700';
    if (s.includes('transp')) return 'bg-blue-100 text-blue-700';
    if (s.includes('proc')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  }

  print(): void {
    window.print();
  }
}
