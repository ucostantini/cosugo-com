import { inject, Injectable } from '@angular/core';
import { DataService } from './data-service';
import {
  Categoria,
  CategoriaScore,
  DbScore, GlobalEntry, Indicatore,
  IndicatoreScore, PerCategoryEntry, PerIndicatorEntry,
  Provincia,
  ProvinciaValore,
  Ranking, Score,
  Valori
} from '../core/data';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private readonly keyOf = (category: string, indicator: string) => `${category}::${indicator}`;

  private provinciaValori: DbScore;

  constructor() {
    this.provinciaValori = {
      indicatorValues: new Map(),
      locations: new Set()
    };
  }

  setProvinciaValori(provinciaValori: DbScore) {
    this.provinciaValori = provinciaValori;
  }


  // incremental accumulators:
  // globalAcc: location -> { sumWeightedDistance, sumCoefficients }
  private readonly globalAcc = new Map<Provincia, { sumWeightedDistance: number; sumCoefficients: number }>();

  // perCategoryAcc: category -> (location -> { sumWeightedDistance, sumCoefficients })
  private readonly perCategoryAcc = new Map<Categoria, Map<Provincia, { sumWeightedDistance: number; sumCoefficients: number }>>();

  // which indicators are currently active, and theScore used
  // key = this.keyOf(category, indicator) ->Score
  private readonly activePrefs = new Map<string, Indicatore>();



  /** Helper: apply a weighted contribution to accumulators (positive or negative). */
  private applyWeightedContribution(
    category: Categoria,
    location: Provincia,
    weightedDistanceDelta: number, // positive to add, negative to remove
    coeffDelta: number // positive to add, negative to remove
  ) {
    // Global accumulator
    const g = this.globalAcc.get(location);
    if (g) {
      g.sumWeightedDistance += weightedDistanceDelta;
      g.sumCoefficients += coeffDelta;
      if (g.sumCoefficients <= 0) {
        // remove to keep maps small and avoid division by zero
        this.globalAcc.delete(location);
      }
    } else if (coeffDelta > 0) {
      this.globalAcc.set(location, {sumWeightedDistance: weightedDistanceDelta, sumCoefficients: coeffDelta});
    }

    // Per-category accumulator
    let catMap = this.perCategoryAcc.get(category);
    if (!catMap) {
      if (coeffDelta > 0) {
        catMap = new Map();
        this.perCategoryAcc.set(category, catMap);
      } else {
        // trying to remove from a non-existing cat map — nothing to do
        return;
      }
    }

    const c = catMap.get(location);
    if (c) {
      c.sumWeightedDistance += weightedDistanceDelta;
      c.sumCoefficients += coeffDelta;
      if (c.sumCoefficients <= 0) {
        catMap.delete(location);
      }
    } else if (coeffDelta > 0) {
      catMap.set(location, {sumWeightedDistance: weightedDistanceDelta, sumCoefficients: coeffDelta});
    }

    // If category map became empty, remove it entirely
    if (catMap.size === 0) this.perCategoryAcc.delete(category);
  }

  /** Internal: add contributions of aScore (used by select and update). */
  private addPreferenceContributions(pref: Indicatore) {
    const k = this.keyOf(pref.categoria, pref.name);
    const arr = this.provinciaValori.indicatorValues.get(k) ?? [];
    for (const { location, avgValue } of arr) {
      const distance = Math.abs(avgValue - pref.valore);
      const weighted = pref.coefficiente * distance;
      this.applyWeightedContribution(pref.categoria, location, weighted, pref.coefficiente);
    }
  }

  /** Internal: remove contributions of aScore (used by deselect and update). */
  private removePreferenceContributions(pref: Indicatore) {
    const k = this.keyOf(pref.categoria, pref.name);
    const arr = this.provinciaValori.indicatorValues.get(k) ?? [];
    for (const { location, avgValue } of arr) {
      const distance = Math.abs(avgValue - pref.valore);
      const weighted = pref.coefficiente * distance;
      // Subtract contributions
      this.applyWeightedContribution(pref.categoria, location, -weighted, -pref.coefficiente);
    }
  }

  /**
   * Select an indicator (apply itsScore). This updates per-category and global accumulators.
   * If already selected, it's a no-op.
   */
  selectIndicator(pref:Indicatore) {
    const k = this.keyOf(pref.categoria, pref.name);
    if (this.activePrefs.has(k)) return; // already selected
    // add contributions
    this.addPreferenceContributions(pref);
    // store the active pref so we can update or remove later
    this.activePrefs.set(k, { ...pref });
  }

  /**
   * Deselect an indicator (remove itsScore contributions).
   * If not selected, no-op.
   */
  deselectIndicator(pref:Indicatore) {
    const k = this.keyOf(pref.categoria, pref.name);
    const stored = this.activePrefs.get(k);
    if (!stored) return; // not active
    // Remove contributions of the stored preference (not the passed one — stored is canonical)
    this.removePreferenceContributions(stored);
    this.activePrefs.delete(k);
  }

  /**
   * Update an indicator'sScore in-place.
   * If the indicator is active, we remove old contributions (from stored activePref) and apply the new one.
   * If the indicator is not active, we simply select it (add new pref).
   */
  updateIndicator(pref:Indicatore) {
    const k = this.keyOf(pref.categoria, pref.name);
    const stored = this.activePrefs.get(k);
    if (stored) {
      // Remove old contributions (based on stored pref)
      this.removePreferenceContributions(stored);
      // Add new contributions (based on incoming pref)
      this.addPreferenceContributions(pref);
      // Replace stored pref with the new one
      this.activePrefs.set(k, { ...pref });
    } else {
      // Not active — just select it
      this.selectIndicator(pref);
    }
  }

  /** Set the entire active selection at once (clear previous and select provided prefs). */
  setSelection(preferences:Indicatore[]) {
    // clear internals
    this.globalAcc.clear();
    this.perCategoryAcc.clear();
    this.activePrefs.clear();

    for (const p of preferences) {
      this.addPreferenceContributions(p);
      this.activePrefs.set(this.keyOf(p.categoria, p.name), { ...p });
    }
  }

  /** Compute per-indicator ranking on demand (simple method). */
  getPerIndicatorRanking(pref:Indicatore): PerIndicatorEntry[] {
    const k = this.keyOf(pref.categoria, pref.name);
    const arr = this.provinciaValori.indicatorValues.get(k) ?? [];
    // compute scores then sort
    const scored = arr.map(({ location, avgValue }) => {
      const distance = Math.abs(avgValue - pref.valore);
      return { category: pref.categoria, indicator: pref.name, location, avgValue, score: pref.coefficiente * distance } as PerIndicatorEntry;
    });

    scored.sort((a, b) => a.score - b.score || a.location.localeCompare(b.location));
    for (let i = 0; i < scored.length; i++) scored[i].rank = i + 1;
    return scored;
  }

  /**
   * Optional: faster per-indicator ranking without sorting by score:
   * Using the fact that indicatorValues[k] is sorted by avgValue, we can binary-search for the insertion index
   * of valore and then expand outwards getting the nearest-by-distance order in O(L) time (no sort).
   */
  getPerIndicatorRankingByBinarySearch(pref:Indicatore): PerIndicatorEntry[] {
    const k = this.keyOf(pref.categoria, pref.name);
    const arr = this.provinciaValori.indicatorValues.get(k) ?? [];
    if (arr.length === 0) return [];

    // find insertion index (first item with avgValue >= valore)
    let lo = 0, hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid].avgValue < pref.valore) lo = mid + 1;
      else hi = mid;
    }

    // expand from lo-1 (left) and lo (right)
    let left = lo - 1, right = lo;
    const result: PerIndicatorEntry[] = [];
    while (left >= 0 || right < arr.length) {
      if (left < 0) {
        const it = arr[right++];
        const sc = pref.coefficiente * Math.abs(it.avgValue - pref.valore);
        result.push({ category: pref.categoria, indicator: pref.name, location: it.location, avgValue: it.avgValue, score: sc } as PerIndicatorEntry);
      } else if (right >= arr.length) {
        const it = arr[left--];
        const sc = pref.coefficiente * Math.abs(it.avgValue - pref.valore);
        result.push({ category: pref.categoria, indicator: pref.name, location: it.location, avgValue: it.avgValue, score: sc } as PerIndicatorEntry);
      } else {
        const leftDist = Math.abs(arr[left].avgValue - pref.valore);
        const rightDist = Math.abs(arr[right].avgValue - pref.valore);
        if (leftDist <= rightDist) {
          const it = arr[left--];
          result.push({ category: pref.categoria, indicator: pref.name, location: it.location, avgValue: it.avgValue, score: pref.coefficiente * leftDist } as PerIndicatorEntry);
        } else {
          const it = arr[right++];
          result.push({ category: pref.categoria, indicator: pref.name, location: it.location, avgValue: it.avgValue, score: pref.coefficiente * rightDist } as PerIndicatorEntry);
        }
      }
    }

    // assign ranks
    for (let i = 0; i < result.length; i++) result[i].rank = i + 1;
    return result;
  }

  /** Return per-category ranking for the given category (derived from accumulators). */
  getPerCategoryRanking(category: Categoria): PerCategoryEntry[] {
    const catMap = this.perCategoryAcc.get(category);
    if (!catMap) return [];

    const arr: PerCategoryEntry[] = [];
    for (const [location, { sumWeightedDistance, sumCoefficients }] of catMap.entries()) {
      arr.push({ category, location, compositeScore: Number((sumWeightedDistance / sumCoefficients).toFixed(2)) });
    }
    arr.sort((a, b) => a.compositeScore - b.compositeScore || a.location.localeCompare(b.location));
    for (let i = 0; i < arr.length; i++) arr[i].rank = i + 1;
    return arr;
  }

  /** Return global ranking across all selected indicators. */
  getGlobalRanking(): GlobalEntry[] {
    const arr: GlobalEntry[] = [];
    for (const [location, { sumWeightedDistance, sumCoefficients }] of this.globalAcc.entries()) {
      arr.push({ location, compositeScore: Number((sumWeightedDistance / sumCoefficients).toFixed(2)) });
    }
    arr.sort((a, b) => a.compositeScore - b.compositeScore || a.location.localeCompare(b.location));
    for (let i = 0; i < arr.length; i++) arr[i].rank = i + 1;
    return arr;
  }

  /** List currently active keys (category::indicator). */
  activeIndicators() {
    return Array.from(this.activePrefs.keys());
  }

  /** Is a given pref active? */
  isActive(pref:Indicatore) {
    return this.activePrefs.has(this.keyOf(pref.categoria, pref.name));
  }

}
