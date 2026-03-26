import { Injectable } from '@angular/core';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  trackPageView(path: string, title?: string): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href
      });
    }
  }

  trackEvent(eventName: string, params?: Record<string, any>): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }
}