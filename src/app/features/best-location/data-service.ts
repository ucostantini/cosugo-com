import { inject, Injectable, LOCALE_ID } from '@angular/core';
import {
  DbScore, MapFeature, FeatureProperties,
  Indicatore,
  IndicatoreKey,
  IndicatorValues,
  Locations,
  Provincia,
  ProvinciaValore,
  QDV,
  Valori
} from './data';
import { DatabaseService } from './database-service';
import { type SqlValue } from 'sql.js';
import { Loc, translationMap } from './translation';
import { LocalStorageService } from '../../common/services/local-storage-service';
import { Observable } from 'rxjs';
import { FeatureCollection } from 'geojson';

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

  getProvinciaValori(): IndicatorValues {
    const currentDbScore = this.localStorageService.getItem<IndicatorValues>("indicatorValues");
    if (currentDbScore) return currentDbScore;

    const val = this.db.executeQuery('SELECT QDV2024."DENOMINAZIONE CORRENTE", QDV2024."CODICE PROVINCIA ISTAT (STORICO)", QDV2024.CATEGORIA, QDV2024.INDICATORE, QDV2024.VALORE FROM QDV2024');

    // precomputed averages per (category::indicator) => array of { location, avgValue }
    const indicatorValues: IndicatorValues = new Map<string, Array<{ location: Provincia; locationCode: string; avgValue: number }>>();

    const tmp = new Map<string, Map<Provincia, { locationCode: string; sum: number; count: number }>>();

    const keyOf = (category: string, indicator: string) => `${category}::${indicator}`;


    val[0].values.forEach((row: SqlValue[]) => {
      const value: number = Number((row[4] as number).toFixed(2));

      const k = keyOf(translationMap[(row[2] as string)][this.locale as Loc], translationMap[(row[3] as string)][this.locale as Loc]);
      let map = tmp.get(k);
      if (!map) {
        map = new Map();
        tmp.set(k, map);
      }
      const acc = map.get(row[0] as string);
      if (acc) {
        acc.sum += value;
        acc.count += 1;
      } else {
        map.set(row[0] as string, {locationCode: row[1] as string, sum: value, count: 1});
      }
    });


    for (const [k, locMap] of tmp.entries()) {
      const arr: Array<{ location: Provincia; locationCode: string; avgValue: number }> = [];
      for (const [loc, {locationCode, sum, count}] of locMap.entries()) {
        arr.push({location: loc, locationCode: locationCode, avgValue: sum / count});
      }
      indicatorValues.set(k, arr);
    }

    this.localStorageService.setItem<IndicatorValues>("indicatorValues", indicatorValues);
    return indicatorValues;
  }

  getGeoJsonData(): Observable<FeatureCollection<MapFeature, FeatureProperties>> {
    return this.db.getGeoJsonData();
  }
}
