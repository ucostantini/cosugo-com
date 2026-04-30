import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { Accordion } from 'govuk-frontend';

// Per-element guard, survives re-creates during HMR thanks to dataset, and
// avoids re-inits in the same session via WeakMap.
const appInitMap = new WeakMap<HTMLElement, boolean>();
const APP_DATA_FLAG = 'appGovukAccordionInitialised';

@Directive({
  selector: '[appGovukAccordion]',
  standalone: true
})
export class GovukAccordionDirective implements AfterViewInit, OnDestroy {
  private accordionInstance?: any;
  private observer?: MutationObserver;
  private scheduled = false;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      // Initial init after next frame so children exist
      requestAnimationFrame(() => this.initSafely());

      // Observe only structural changes (added/removed sections), not attributes
      this.observer = new MutationObserver((records) => {
        if (!this.shouldRecheck(records)) return;
        if (this.scheduled) return;
        this.scheduled = true;
        requestAnimationFrame(() => {
          this.scheduled = false;
          this.initSafely();
        });
      });

      this.observer.observe(this.el.nativeElement, {
        childList: true,
        subtree: true
      });
    });
  }

  private isAlreadyInitialised(host: HTMLElement): boolean {
    // GOV.UK markers, if present
    const govukInit =
      host.hasAttribute('data-govuk-accordion-initialised') ||
      host.classList.contains('govuk-accordion--js-enabled');

    // Our own markers
    const appDatasetFlag = (host as any).dataset?.[APP_DATA_FLAG] === '1';
    const appWeakMapFlag = appInitMap.get(host) === true;

    return govukInit || appDatasetFlag || appWeakMapFlag;
  }

  private hasSections(host: HTMLElement): boolean {
    return !!host.querySelector('.govuk-accordion__section');
  }

  private markInitialised(host: HTMLElement): void {
    appInitMap.set(host, true);
    try {
      if ((host as any).dataset) {
        (host as any).dataset[APP_DATA_FLAG] = '1';
      }
    } catch {
      // ignore dataset write failures
    }
  }

  private initSafely(): void {
    const host = this.el.nativeElement;

    // Only init if it looks like an accordion, and not already initialised
    if (!this.hasSections(host) || this.isAlreadyInitialised(host)) return;

    try {
      this.accordionInstance = new Accordion(host);
      this.markInitialised(host);
    } catch (e: any) {
      // Swallow duplicate-init errors thrown by GOV.UK Frontend
      const msg = String(e?.message || '');
      if (msg.toLowerCase().includes('already initialised')) {
        this.markInitialised(host);
        return;
      }
      // Re-throw any other unexpected errors
      throw e;
    }
  }

  // Only re-check when sections are added/removed, not on minor DOM changes.
  private shouldRecheck(records: MutationRecord[]): boolean {
    const isSectionNode = (n: Node) =>
      n instanceof HTMLElement &&
      (n.classList.contains('govuk-accordion__section') ||
        !!n.querySelector?.('.govuk-accordion__section'));

    for (const rec of records) {
      if (rec.type === 'childList') {
        const added = Array.from(rec.addedNodes).some(isSectionNode);
        const removed = Array.from(rec.removedNodes).some(isSectionNode);
        if (added || removed) return true;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
    if (this.accordionInstance && typeof this.accordionInstance.destroy === 'function') {
      this.accordionInstance.destroy();
    }
  }
}
