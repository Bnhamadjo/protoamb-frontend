import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageService, Page } from '../services/page.service';

@Component({
  standalone: true,
  selector: 'app-page-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PagesListComponent implements OnInit {
  pages: Page[] = [];
  loading = true;
  error = '';

  constructor(private service: PageService) {}

  ngOnInit(): void {
    this.service.all().subscribe({
      next: (res) => { this.pages = res; this.loading = false; },
      error: () => { this.error = 'Falha ao carregar páginas.'; this.loading = false; }
    });
  }

  delete(id: number) {
    if (!confirm('Tem certeza que deseja eliminar esta página?')) return;
    this.service.delete(id).subscribe({
      next: () => this.pages = this.pages.filter(p => p.id !== id),
      error: () => alert('Não foi possível eliminar a página.')
    });
  }
}