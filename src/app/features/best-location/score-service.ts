import { Injectable } from '@angular/core';
import {
  Categoria,
  GlobalEntry,
  Indicatore,
  IndicatorValues,
  PerCategoryEntry,
  PerIndicatorEntry,
  Provincia,
} from './data';

// A reusable type for our accumulator entries
type Accumulator = { sumWeightedDistance: number; sumCoefficients: number };

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private provinciaValori: IndicatorValues = new Map();
  private readonly globalAcc = new Map<Provincia, Accumulator & { locationCode: string }>();
  private readonly perCategoryAcc = new Map<Categoria, Map<Provincia, Accumulator>>();
  private readonly activePrefs = new Map<string, Indicatore>();

  private readonly keyOf = (category: string, indicator: string) => `${category}::${indicator}`;

  setProvinciaValori(provinciaValori: IndicatorValues) {
    this.provinciaValori = provinciaValori;
  }

  // --- PUBLIC API ---

  selectIndicator(pref: Indicatore): void {
    const key = this.keyOf(pref.categoria, pref.name);
    if (this.activePrefs.has(key)) {
      return;
    }
    this.modifyPreferenceContributions(pref, 'add');
    this.activePrefs.set(key, { ...pref });
  }

  deselectIndicator(pref: Indicatore): void {
    const key = this.keyOf(pref.categoria, pref.name);
    const storedPref = this.activePrefs.get(key);
    if (!storedPref) {
      return;
    }
    this.modifyPreferenceContributions(storedPref, 'remove');
    this.activePrefs.delete(key);
  }

  updateIndicator(pref: Indicatore): void {
    const key = this.keyOf(pref.categoria, pref.name);
    const storedPref = this.activePrefs.get(key);

    if (storedPref) {
      this.modifyPreferenceContributions(storedPref, 'remove');
    }
    this.modifyPreferenceContributions(pref, 'add');
    this.activePrefs.set(key, { ...pref });
  }

  setSelection(preferences: Indicatore[]): void {
    this.globalAcc.clear();
    this.perCategoryAcc.clear();
    this.activePrefs.clear();

    for (const pref of preferences) {
      this.modifyPreferenceContributions(pref, 'add');
      this.activePrefs.set(this.keyOf(pref.categoria, pref.name), { ...pref });
    }
  }

  getPerIndicatorRanking(pref: Indicatore): PerIndicatorEntry[] {
    const key = this.keyOf(pref.categoria, pref.name);
    const values = this.provinciaValori.get(key) ?? [];

    const scored = values.map(({ location, avgValue }) => ({
      category: pref.categoria,
      indicator: pref.name,
      location,
      avgValue,
      score: pref.coefficiente * Math.abs(avgValue - pref.valore),
    }));

    return this.rank(scored, item => item.score);
  }

  getPerCategoryRanking(category: Categoria): PerCategoryEntry[] {
    const catMap = this.perCategoryAcc.get(category);
    if (!catMap) {
      return [];
    }
    const scored = Array.from(catMap.entries()).map(([location, acc]) => ({
      category,
      location,
      compositeScore: this.calculateScore(acc),
    }));

    return this.rank(scored, item => item.compositeScore);
  }

  getGlobalRanking(): GlobalEntry[] {
    const scored = Array.from(this.globalAcc.entries()).map(([location, acc]) => ({
      location,
      locationCode: acc.locationCode,
      compositeScore: this.calculateScore(acc),
    }));

    return this.rank(scored, item => item.compositeScore);
  }

  activeIndicators(): string[] {
    return Array.from(this.activePrefs.keys());
  }

  isActive(pref: Indicatore): boolean {
    return this.activePrefs.has(this.keyOf(pref.categoria, pref.name));
  }

  // --- PRIVATE HELPERS ---

  private calculateScore(acc: Accumulator): number {
    if (acc.sumCoefficients === 0) {
      return 0;
    }
    return Number((acc.sumWeightedDistance / acc.sumCoefficients).toFixed(2));
  }

  private rank<T extends { location: string }>(items: T[], scoreAccessor: (item: T) => number): (T & { rank: number })[] {
    items.sort((a, b) => scoreAccessor(a) - scoreAccessor(b) || a.location.localeCompare(b.location));
    return items.map((item, index) => ({ ...item, rank: index + 1 }));
  }

  private modifyPreferenceContributions(pref: Indicatore, operation: 'add' | 'remove'): void {
    const key = this.keyOf(pref.categoria, pref.name);
    const values = this.provinciaValori.get(key) ?? [];
    const sign = operation === 'add' ? 1 : -1;

    for (const { location, locationCode, avgValue } of values) {
      const distance = Math.abs(avgValue - pref.valore);
      const weightedDistanceDelta = sign * pref.coefficiente * distance;
      const coeffDelta = sign * pref.coefficiente;
      this.applyWeightedContribution(pref.categoria, location, locationCode, weightedDistanceDelta, coeffDelta);
    }
  }

  private applyWeightedContribution(
    category: Categoria,
    location: Provincia,
    locationCode: string,
    weightedDistanceDelta: number,
    coeffDelta: number
  ): void {
    this.updateAccumulator(this.globalAcc, location, weightedDistanceDelta, coeffDelta, () => ({
      locationCode,
      sumWeightedDistance: weightedDistanceDelta,
      sumCoefficients: coeffDelta,
    }));

    let catMap = this.perCategoryAcc.get(category);
    if (!catMap && coeffDelta > 0) {
      catMap = new Map();
      this.perCategoryAcc.set(category, catMap);
    }

    if (catMap) {
      this.updateAccumulator(catMap, location, weightedDistanceDelta, coeffDelta, () => ({
        sumWeightedDistance: weightedDistanceDelta,
        sumCoefficients: coeffDelta,
      }));
      if (catMap.size === 0) {
        this.perCategoryAcc.delete(category);
      }
    }
  }

  private updateAccumulator<T extends Accumulator>(
    map: Map<Provincia, T>,
    location: Provincia,
    weightedDistanceDelta: number,
    coeffDelta: number,
    create: () => T
  ): void {
    const acc = map.get(location);
    if (acc) {
      acc.sumWeightedDistance += weightedDistanceDelta;
      acc.sumCoefficients += coeffDelta;
      // Use a small epsilon for float comparison to avoid precision issues
      if (acc.sumCoefficients < 1e-6) {
        map.delete(location);
      }
    } else if (coeffDelta > 0) {
      map.set(location, create());
    }
  }
}
