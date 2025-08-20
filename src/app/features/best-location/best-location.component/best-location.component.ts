import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data-service';
import {
  Categoria,
  CategoriaScore, GlobalEntry,
  Indicatore,
  IndicatoreKey,
  IndicatoreScore,
  QDV,
  Score,
  ScoreForm
} from './core/data';
import { DatabaseService } from './services/database-service';
import { GovukAccordionDirective } from './govuk-accordion-directive';
import { GovukSlider } from './govuk-slider/govuk-slider';
import { GovukLoadingSpinner } from './govuk-loading-spinner/govuk-loading-spinner';
import { IndicatoreValore } from './indicatore-valore/indicatore-valore';
import { ScoreService } from './services/score-service';
import { Ranking } from './ranking/ranking';
import { LocalStorageService } from './services/local-storage-service';

@Component({
  selector: 'app-best-location',
  imports: [RouterOutlet, GovukAccordionDirective, GovukLoadingSpinner, IndicatoreValore, Ranking],
  templateUrl: './best-location.component.html',
  standalone: true,
  styleUrl: './best-location.component.scss'
})
export class BestLocation implements OnInit {
  protected readonly dataService: DataService = inject(DataService);
  protected readonly scoreService: ScoreService = inject(ScoreService);
  private readonly localStorage: LocalStorageService = inject(LocalStorageService);
  protected isDbLoaded = false;
  protected data: QDV = new Map<Categoria, Indicatore[]>();
  protected score: GlobalEntry[] = [];
  private readonly scores: QDV = new Map<Categoria, Indicatore[]>();

  ngOnInit(): void {
    this.dataService.initDb().then(r => {
      this.data = this.localStorage.getItem<QDV>('score') ?? this.dataService.getQdv();
      this.scoreService.setProvinciaValori(this.dataService.getProvinciaValori());
      this.isDbLoaded = true;
    });

  }


  onIndicatorChange($event: Indicatore): void {
    console.log($event);
    if (!this.scores.has($event.categoria)) {
      this.scores.set($event.categoria, [$event]);
    } else {
      this.scores.get($event.categoria)!.push($event)
    }

    if ($event.isSelected) {
      this.scoreService.updateIndicator($event);
    } else if (this.scoreService.isActive($event)) {
      this.scoreService.deselectIndicator($event);
    }
    this.score = this.scoreService.getGlobalRanking();
    console.log(this.score);
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(_: any) {
    this.localStorage.setItem<QDV>('score', this.scores);
  }
}
