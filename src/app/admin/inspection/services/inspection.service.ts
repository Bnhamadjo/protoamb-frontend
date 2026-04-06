import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { API_BASE } from '../../../api-config';

export interface Ocorrencia {
  id?: number;
  titulo: string;
  descricao: string;
  tipo: string;
  status: 'pendente' | 'em analise' | 'atribuida' | 'em missao' | 'resolvida' | 'arquivada';
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  localizacao?: string;
  latitude?: number;
  longitude?: number;
  relator_id?: number;
  equipa_id?: number;
  data_ocorrencia?: string;
  created_at?: string;
  updated_at?: string;
  equipa?: any;
  relator?: any;
  evidencias?: any[];
}

export interface Missao {
  id?: number;
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim_prevista?: string;
  status: 'planeada' | 'em curso' | 'concluida' | 'cancelada';
  equipa_id: number;
  lider_id?: number;
  equipa?: any;
  lider?: any;
  evidencias?: any[];
  acompanhamentos?: any[];
}

@Injectable({ providedIn: 'root' })
export class InspectionService {
  private readonly RECURSO_OCORRENCIAS = API_BASE + '/ocorrencias';
  private readonly RECURSO_MISSOES = API_BASE + '/missoes';
  private readonly RECURSO_EVIDENCIAS = API_BASE + '/evidencias';
  private readonly RECURSO_ACOMPANHAMENTOS = API_BASE + '/acompanhamentos';

  constructor(private http: HttpClient) {}

  // OCCURRENCES
  getOcorrencias(): Observable<Ocorrencia[]> {
    return this.http.get<Ocorrencia[]>(this.RECURSO_OCORRENCIAS).pipe(timeout(30000));
  }

  getOcorrencia(id: number): Observable<Ocorrencia> {
    return this.http.get<Ocorrencia>(`${this.RECURSO_OCORRENCIAS}/${id}`).pipe(timeout(30000));
  }

  createOcorrencia(data: Partial<Ocorrencia>): Observable<Ocorrencia> {
    return this.http.post<Ocorrencia>(this.RECURSO_OCORRENCIAS, data).pipe(timeout(30000));
  }

  updateOcorrencia(id: number, data: Partial<Ocorrencia>): Observable<Ocorrencia> {
    return this.http.put<Ocorrencia>(`${this.RECURSO_OCORRENCIAS}/${id}`, data).pipe(timeout(30000));
  }

  deleteOcorrencia(id: number): Observable<any> {
    return this.http.delete(`${this.RECURSO_OCORRENCIAS}/${id}`).pipe(timeout(30000));
  }

  // MISSIONS
  getMissoes(): Observable<Missao[]> {
    return this.http.get<Missao[]>(this.RECURSO_MISSOES).pipe(timeout(30000));
  }

  getMissao(id: number): Observable<Missao> {
    return this.http.get<Missao>(`${this.RECURSO_MISSOES}/${id}`).pipe(timeout(30000));
  }

  createMissao(data: Partial<Missao>): Observable<Missao> {
    return this.http.post<Missao>(this.RECURSO_MISSOES, data).pipe(timeout(30000));
  }

  updateMissao(id: number, data: Partial<Missao>): Observable<Missao> {
    return this.http.put<Missao>(`${this.RECURSO_MISSOES}/${id}`, data).pipe(timeout(30000));
  }

  // EVIDENCES
  addEvidencia(data: any): Observable<any> {
    return this.http.post(this.RECURSO_EVIDENCIAS, data).pipe(timeout(30000));
  }

  // MONITORING
  addAcompanhamento(data: any): Observable<any> {
    return this.http.post(this.RECURSO_ACOMPANHAMENTOS, data).pipe(timeout(30000));
  }
}
