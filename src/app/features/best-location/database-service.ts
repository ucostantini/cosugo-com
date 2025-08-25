import { inject, Injectable } from '@angular/core';
import initSqlJs, { type Database, type QueryExecResult } from 'sql.js';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { FeatureCollection } from 'geojson';
import { MapFeature, FeatureProperties } from './data';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db?: Database;
  private readonly http: HttpClient = inject(HttpClient);
  private _initDb: Promise<void> | null = null;

  loadDatabase(): Promise<void> {
    if (this._initDb) return this._initDb;
    this._initDb = (async () => {
    try {
      const sqlPromise = initSqlJs({
        locateFile: (file) => `/assets/sql.js/${file}`
      });
      const dataPromise = firstValueFrom(this.http.get('assets/QDV2024.sqlite', {responseType: 'arraybuffer'}));

        const [SQL, dbFile] = await Promise.all([sqlPromise, dataPromise]);

        const bytes = new Uint8Array(dbFile);
        const magic = "SQLite format 3\u0000";
        const header = String.fromCharCode(...bytes.slice(0, magic.length));
        if (header !== magic) {
          throw new Error('Downloaded file is not a valid SQLite database (magic header mismatch). Check the path and that the file is under /assets/.');
        }

        this.db = new SQL.Database(new Uint8Array(dbFile));

      // You can now execute queries on this.db
    } catch (error) {
      this._initDb = null;
      console.error('Failed to load database.', error);
      throw error;
    }

    })();

    return this._initDb;
  }

  // Add methods to query the database
  public executeQuery(query: string): QueryExecResult[] {
    console.log('EXECUTE:', query);
    if (!this.db) {
      throw new Error('Database not loaded yet.');
    }
    return this.db.exec(query);
  }

  getGeoJsonData(): Observable<FeatureCollection<MapFeature, FeatureProperties>> {
    return this.http.get<FeatureCollection<MapFeature, FeatureProperties>>('assets/IT_provinces.geojson');
  }
}
