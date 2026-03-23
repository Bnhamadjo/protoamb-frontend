import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss']
})
export class ToastComponent implements OnInit {
  message = '';
  type: 'success' | 'error' | null = null;
  visible = false;

  constructor(private toast: ToastService) {}

  ngOnInit() {
    this.toast.toast$.subscribe(data => {
      this.message = data.message;
      this.type = data.type;
      this.visible = true;
      setTimeout(() => this.visible = false, 3000);
    });
  }
}