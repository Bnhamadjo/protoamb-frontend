import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { InspectionService, Missao } from '../services/inspection.service';
import { UploadService } from '../../../services/upload.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../core/auth';

@Component({
  selector: 'app-missao-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6" *ngIf="missao">
      <div class="flex justify-between items-center mb-6">
        <div>
          <a routerLink="/admin/inspection/missoes" class="text-blue-600 text-sm hover:underline">← Voltar para a lista</a>
          <h1 class="text-3xl font-bold mt-2">{{ missao.titulo }}</h1>
        </div>
        <div class="flex gap-2">
          <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            Editar Missão
          </button>
          <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" (click)="concluir()" *ngIf="missao.status !== 'concluida'">
            Concluir Missão
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-bold mb-4 border-b pb-2">Informações da Missão</h2>
            <p class="text-gray-700 mb-4">{{ missao.descricao || 'Nenhuma descrição fornecida.' }}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-400 block mb-1">Início</span>
                <span class="font-bold">{{ missao.data_inicio ? (missao.data_inicio | date:'dd/MM/yyyy HH:mm') : 'Não definido' }}</span>
              </div>
              <div class="p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-400 block mb-1">Fim Previsto</span>
                <span class="font-bold">{{ missao.data_fim_prevista ? (missao.data_fim_prevista | date:'dd/MM/yyyy HH:mm') : 'Não definido' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="flex justify-between items-center mb-4 border-b pb-2 text-blue-600">
               <h2 class="text-lg font-bold">Acompanhamento Técnico (Diário de Campo)</h2>
               <button class="text-sm font-bold hover:underline" (click)="isAddingAcompanhamento = !isAddingAcompanhamento">
                 {{ isAddingAcompanhamento ? 'Cancelar' : '+ NOVO REGISTO' }}
               </button>
            </div>

            <!-- Form Novo Acompanhamento -->
            <div *ngIf="isAddingAcompanhamento" class="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100 anim-up">
               <h3 class="font-bold mb-3 text-sm">Registar Visita/Ação de Campo</h3>
               <textarea [(ngModel)]="novoAcompanhamento.relatorio" class="w-full p-3 border rounded-lg mb-3 text-sm" rows="3" placeholder="O que foi feito ou observado hoje?"></textarea>
               <input [(ngModel)]="novoAcompanhamento.conclusoes" class="w-full p-3 border rounded-lg mb-3 text-sm" placeholder="Conclusões ou recomendações">
               <div class="flex justify-end">
                 <button class="bg-blue-600 text-white px-4 py-2 rounded font-bold text-xs" (click)="saveAcompanhamento()" [disabled]="!novoAcompanhamento.relatorio">
                   GUARDAR NO DIÁRIO
                 </button>
               </div>
            </div>

            <div class="space-y-4 mb-6">
              <div *ngFor="let ac of missao.acompanhamentos" class="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-bold">{{ ac.data_visita | date:'dd/MM/yyyy' }}</span>
                  <span class="text-xs text-gray-500">Por: {{ ac.user?.name || 'Técnico' }}</span>
                </div>
                <p class="text-gray-700">{{ ac.relatorio }}</p>
                <div *ngIf="ac.conclusoes" class="mt-2 pt-2 border-t border-blue-100 text-sm">
                  <strong>Conclusões:</strong> {{ ac.conclusoes }}
                </div>
              </div>
              <div *ngIf="!missao.acompanhamentos?.length" class="text-center py-6 text-gray-400 italic">
                Nenhum acompanhamento técnico registado ainda.
              </div>
            </div>
          </div>

          <!-- Evidências -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="flex justify-between items-center mb-4 border-b pb-2">
              <h2 class="text-lg font-bold">Evidências Fotografadas</h2>
              <button class="text-blue-600 font-medium hover:underline text-sm" (click)="fileInput.click()">
                + Upload Foto
              </button>
              <input #fileInput type="file" (change)="onFileSelected($event)" class="hidden" accept="image/*">
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4" *ngIf="missao.evidencias?.length; else noEvidencias">
              <div *ngFor="let ev of missao.evidencias" class="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                <img [src]="ev.arquivo_path" class="w-full h-full object-cover">
              </div>
            </div>
            <ng-template #noEvidencias>
              <div class="p-8 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                Nenhuma foto ou documento anexado.
              </div>
            </ng-template>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-bold mb-4 border-b pb-2">Equipa e Liderança</h2>
            <div class="flex items-center gap-4 mb-4" *ngIf="missao.equipa">
              <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {{ missao.equipa.nome.charAt(0) }}
              </div>
              <div>
                <p class="font-bold">{{ missao.equipa.nome }}</p>
                <p class="text-xs text-gray-500">Equipa Técnica</p>
              </div>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg text-sm">
              <span class="text-gray-400 block mb-1">Líder da Missão</span>
              <span class="font-bold text-gray-700">{{ missao.lider?.name || 'Não atribuído' }}</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-bold mb-4 border-b pb-2">Estado</h2>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" [ngClass]="getStatusColor(missao.status)"></div>
              <span class="font-bold uppercase tracking-wider text-sm">{{ missao.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-planeada { background-color: #3b82f6; }
    .bg-curso { background-color: #f59e0b; }
    .bg-concluida { background-color: #10b981; }
    .bg-cancelada { background-color: #ef4444; }
  `]
})
export class MissaoDetailComponent implements OnInit {
  missao?: Missao;
  isAddingAcompanhamento = false;
  novoAcompanhamento = { relatorio: '', conclusoes: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService,
    private uploadService: UploadService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.inspectionService.getMissao(id).subscribe((data: Missao) => {
        this.missao = data;
      });
    }
  }

  saveAcompanhamento() {
    this.inspectionService.addAcompanhamento({
      missao_id: this.missao!.id,
      relatorio: this.novoAcompanhamento.relatorio,
      conclusoes: this.novoAcompanhamento.conclusoes,
      data_visita: new Date().toISOString(),
      user_id: this.auth.getUser()?.id
    }).subscribe(() => {
      this.toast.success('Registo de campo adicionado');
      this.isAddingAcompanhamento = false;
      this.novoAcompanhamento = { relatorio: '', conclusoes: '' };
      this.ngOnInit();
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.upload(file).subscribe((res: any) => {
        this.inspectionService.addEvidencia({
          missao_id: this.missao!.id,
          arquivo_path: res.url,
          tipo: 'foto',
          user_id: this.auth.getUser()?.id
        }).subscribe(() => {
          this.toast.success('Evidência adicionada');
          this.ngOnInit();
        });
      });
    }
  }

  concluir() {
    if (confirm('Deseja marcar esta missão como concluída?')) {
      this.inspectionService.updateMissao(this.missao!.id!, { status: 'concluida' }).subscribe(() => {
        this.ngOnInit();
      });
    }
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'planeada': return 'bg-blue-500';
      case 'em curso': return 'bg-orange-500';
      case 'concluida': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }
}
