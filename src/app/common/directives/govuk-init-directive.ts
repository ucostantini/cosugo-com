import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import {
  Accordion,
  Button,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  ExitThisPage,
  Header,
  NotificationBanner,
  Radios,
  ServiceNavigation,
  SkipLink,
  Tabs
} from 'govuk-frontend';

const componentMap: { [key: string]: any } = {
  'govuk-accordion': Accordion,
  'govuk-button': Button,
  'govuk-character-count': CharacterCount,
  'govuk-checkboxes': Checkboxes,
  'govuk-error-summary': ErrorSummary,
  'govuk-exit-this-page': ExitThisPage,
  'govuk-header': Header,
  'govuk-notification-banner': NotificationBanner,
  'govuk-radios': Radios,
  'govuk-skip-link': SkipLink,
  'govuk-tabs': Tabs,
  'govuk-service-navigation': ServiceNavigation
};

@Directive({
  selector: '[data-module]',
  standalone: true,
})
export class GovukInitDirective implements AfterViewInit, OnDestroy {
  @Input('data-module')
  public moduleName = '';
  private instance: any;
  private observer?: MutationObserver;
  private scheduled = false;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.initIfNeeded());

      this.observer = new MutationObserver(() => {
        if (this.scheduled) return;
        this.scheduled = true;
        requestAnimationFrame(() => {
          this.scheduled = false;
          this.initIfNeeded();
        });
      });

      this.observer.observe(this.el.nativeElement, {
        childList: true,
        subtree: true,
      });
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.instance && typeof this.instance.destroy === 'function') {
      this.instance.destroy();
    }
  }

  private isInitialised(): boolean {
    return this.el.nativeElement.hasAttribute('data-govuk-component-initialised');
  }

  private markInitialised(): void {
    this.el.nativeElement.setAttribute('data-govuk-component-initialised', 'true');
  }

  private initIfNeeded(): void {
    if (!this.moduleName || this.isInitialised()) {
      return;
    }

    const ComponentClass = componentMap[this.moduleName];
    if (ComponentClass) {
      try {
        this.instance = new ComponentClass(this.el.nativeElement);
        this.markInitialised();
      } catch (e: any) {
        if (String(e?.message).includes('already initialised')) {
          this.markInitialised();
        } else {
          console.error(e);
        }
      }
    }
  }
}
