import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

interface PageStat {
  label: string;
  value: string;
  caption: string;
}

interface PageAction {
  label: string;
  link: string;
}

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.css'
})
export class PlaceholderComponent {
  title = 'Trang';
  message = 'Trang này đang được phát triển.';
  icon = '📄';
  status = 'Sắp ra mắt';
  stats: PageStat[] = [];
  highlights: string[] = [];
  actions: PageAction[] = [];

  constructor() {
    const route = inject(ActivatedRoute);
    route.data.subscribe((data) => {
      this.title = data['title'] ?? this.title;
      this.message = data['message'] ?? this.message;
      this.icon = data['icon'] ?? this.icon;
      this.status = data['status'] ?? this.status;
      this.stats = data['stats'] ?? this.stats;
      this.highlights = data['highlights'] ?? this.highlights;
      this.actions = data['actions'] ?? this.actions;
    });
  }
}
