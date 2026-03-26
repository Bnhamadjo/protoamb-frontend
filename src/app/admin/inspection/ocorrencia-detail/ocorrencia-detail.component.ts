import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { InspectionService, Ocorrencia } from '../services/inspection.service';
import { UploadService } from '../../../services/upload.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../core/auth';

@Component({
  selector: 'app-ocorrencia-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6" *ngIf="ocorrencia">
      <div class="flex justify-between items-center mb-6">
        <div>
          <a routerLink="/admin/inspection/ocorrencias" class="text-blue-600 text-sm hover:underline">← Voltar para a lista</a>
          <h1 class="text-3xl font-bold mt-2">{{ ocorrencia.titulo }}</h1>
        </div>
        <div class="flex gap-2">
          <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            Editar
          </button>
          <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition" (click)="delete()">
            Eliminar
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-bold mb-4 border-b pb-2">Descrição</h2>
            <p class="text-gray-700 whitespace-pre-wrap">{{ ocorrencia.descricao }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="flex justify-between items-center mb-4 border-b pb-2">
              <h2 class="text-lg font-bold">Evidências e Fotos</h2>
              <button class="text-blue-600 font-medium hover:underline text-sm" (click)="fileInput.click()">
                + Adicionar Foto
              </button>
              <input #fileInput type="file" (change)="onFileSelected($event)" class="hidden" accept="image/*">
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4" *ngIf="ocorrencia.evidencias?.length; else noEvidencias">
              <div *ngFor="let ev of ocorrencia.evidencias" class="aspect-square bg-gray-100 rounded-lg overflow-hidden border group relative">
                <img [src]="ev.arquivo_path" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                   <a [href]="ev.arquivo_path" target="_blank" class="text-white text-xs font-bold underline">Ver Original</a>
                </div>
              </div>
            </div>
            <ng-template #noEvidencias>
              <div class="p-8 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                Nenhuma evidência registada para esta ocorrência.
              </div>
            </ng-template>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-sm">
            <h2 class="text-lg font-bold mb-4 border-b pb-2">Informações</h2>
            <div class="space-y-4">
              <div>
                <label class="text-gray-400 uppercase text-[10px] font-bold block mb-1">Status</label>
                <div class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase transition" [ngClass]="getStatusClass(ocorrencia.status)">
                  {{ ocorrencia.status }}
                </div>
              </div>
              <div>
                <label class="text-gray-400 uppercase text-[10px] font-bold block mb-1">Gravidade</label>
                <div class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase" [ngClass]="getGravidadeClass(ocorrencia.gravidade)">
                  {{ ocorrencia.gravidade }}
                </div>
              </div>
              <div>
                <label class="text-gray-400 uppercase text-[10px] font-bold block mb-1">Localização</label>
                <p class="font-medium">{{ ocorrencia.localizacao || 'Coordenadas: ' + ocorrencia.latitude + ', ' + ocorrencia.longitude }}</p>
              </div>
              <div>
                <label class="text-gray-400 uppercase text-[10px] font-bold block mb-1">Equipa Atribuída</label>
                <p class="font-medium text-blue-600 cursor-pointer hover:underline" *ngIf="ocorrencia.equipa; else noEquipa">
                  {{ ocorrencia.equipa.nome }}
                </p>
                <ng-template #noEquipa>
                  <p class="text-gray-400 italic">Nenhuma equipa atribuída</p>
                </ng-template>
              </div>
              <div>
                <label class="text-gray-400 uppercase text-[10px] font-bold block mb-1">Data da Ocorrência</label>
                <p>{{ (ocorrencia.data_ocorrencia || ocorrencia.created_at) | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OcorrenciaDetailComponent implements OnInit {
  ocorrencia?: Ocorrencia;

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
      this.inspectionService.getOcorrencia(id).subscribe((data: Ocorrencia) => {
        this.ocorrencia = data;
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.upload(file).subscribe((res: any) => {
        this.inspectionService.addEvidencia({
          ocorrencia_id: this.ocorrencia!.id,
          arquivo_path: res.url,
          tipo: 'foto',
          user_id: this.auth.getUser()?.id
        }).subscribe(() => {
          this.toast.success('Evidência adicionada com sucesso');
          this.ngOnInit();
        });
      });
    }
  }

  delete() {
    if (confirm('Tem a certeza que deseja eliminar esta ocorrência?')) {
      this.inspectionService.deleteOcorrencia(this.ocorrencia!.id!).subscribe(() => {
        this.router.navigate(['/admin/inspection/ocorrencias']);
      });
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em analise': return 'bg-blue-100 text-blue-800';
      case 'resolvida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getGravidadeClass(gravidade: string) {
    switch (gravidade) {
      case 'alta':
      case 'critica': return 'bg-red-100 text-red-800 border border-red-200';
      case 'media': return 'bg-orange-100 text-orange-800 border border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  }
}
