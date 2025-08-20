import { inject, Injectable, LOCALE_ID } from '@angular/core';
import {
  DbScore,
  Indicatore,
  IndicatoreKey,
  IndicatorValues,
  Locations,
  Provincia,
  ProvinciaValore,
  QDV,
  Valori
} from '../core/data';
import { DatabaseService } from './database-service';
import { type SqlValue } from 'sql.js';
import { Loc, translationMap } from '../core/translation';
import { LocalStorageService } from './local-storage-service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly db: DatabaseService = inject(DatabaseService);
  private readonly locale: string = inject(LOCALE_ID);
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);

  public initDb(): Promise<void> {
    return this.db.loadDatabase();
  }

  public getQdv(): QDV {
    const currentQdv = this.localStorageService.getItem<QDV>("qdv");
    if (currentQdv) return currentQdv;

    const val = this.db.executeQuery('SELECT QDV2024.CATEGORIA, QDV2024.INDICATORE, min(QDV2024.VALORE), max(QDV2024.VALORE), "UNITA\' DI MISURA" FROM QDV2024 GROUP BY QDV2024.CATEGORIA, QDV2024.INDICATORE, "UNITA\' DI MISURA"');

    const categorie = new Map<string, Indicatore[]>;
    val[0].values.forEach((row: SqlValue[]) => {

      const indicatore: Indicatore = {
        isSelected: false,
        categoria: translationMap[(row[0] as string)][this.locale as Loc],
        name: translationMap[(row[1] as string)][this.locale as Loc],
        min: +(row[2] as number).toFixed(2),
        max: +(row[3] as number).toFixed(2),
        coefficiente: 1,
        valore: +((Number(row[2]) + Number(row[3])) / 2).toFixed(2),
        unit: translationMap[(row[4] as string)][this.locale as Loc]
      }

      if (!categorie.has(indicatore.categoria)) {
        categorie.set(indicatore.categoria, [indicatore]);
      } else {
        categorie.get(indicatore.categoria)!.push(indicatore)
      }
    });

    this.localStorageService.setItem<QDV>("qdv", categorie);

    return categorie;
  }

  getProvinciaValori(): DbScore {
    const currentDbScore = this.localStorageService.getItem<DbScore>("dbScore");
    if (currentDbScore) return currentDbScore;

    const val = this.db.executeQuery('SELECT QDV2024."DENOMINAZIONE CORRENTE", QDV2024.CATEGORIA, QDV2024.INDICATORE, QDV2024.VALORE FROM QDV2024');

    // precomputed averages per (category::indicator) => array of { location, avgValue }
    const indicatorValues: IndicatorValues = new Map<string, Array<{ location: Provincia; avgValue: number }>>();

    // set of known locations (useful to enumerate all locations)
    const provinces: Locations = new Set<Provincia>();


    const tmp = new Map<string, Map<Provincia, { sum: number; count: number }>>();

    const keyOf = (category: string, indicator: string) => `${category}::${indicator}`;


    val[0].values.forEach((row: SqlValue[]) => {
      const p: ProvinciaValore = {
        provincia: row[0] as string,
        categoria: translationMap[(row[1] as string)][this.locale as Loc],
        indicatore: translationMap[(row[2] as string)][this.locale as Loc],
        valore: Number((row[3] as number).toFixed(2))
      };


      provinces.add(p.provincia);
      const k = keyOf(p.categoria, p.indicatore);
      let map = tmp.get(k);
      if (!map) {
        map = new Map();
        tmp.set(k, map);
      }
      const acc = map.get(p.provincia);
      if (acc) {
        acc.sum += p.valore;
        acc.count += 1;
      } else {
        map.set(p.provincia, {sum: p.valore, count: 1});
      }
    });


    for (const [k, locMap] of tmp.entries()) {
      const arr: Array<{ location: Provincia; avgValue: number }> = [];
      for (const [loc, {sum, count}] of locMap.entries()) {
        arr.push({location: loc, avgValue: sum / count});
      }
      // keep arr sorted by avgValue for optional binary-search ranking
      arr.sort((a, b) => a.avgValue - b.avgValue || a.location.localeCompare(b.location));
      indicatorValues.set(k, arr);
    }

    const dbScore: DbScore = {
      indicatorValues: indicatorValues,
      locations: provinces
    };

    this.localStorageService.setItem<DbScore>("dbScore", dbScore);
    return dbScore;
  }
}
