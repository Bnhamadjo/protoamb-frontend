import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoPayload {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  updatePage(payload: SeoPayload): void {
    const title = payload.title.includes('ProtoAmb') ? payload.title : `${payload.title} | ProtoAmb`;
    const description = payload.description;
    const image = payload.image || '/logo.png';
    const type = payload.type || 'website';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: title });
    this.meta.updateTag({ property: 'twitter:description', content: description });
    this.meta.updateTag({ property: 'twitter:image', content: image });
  }
}
