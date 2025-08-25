import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import { Feature, FeatureCollection, GeometryObject, MultiPolygon, Polygon } from 'geojson';
import { LocalStorageService } from '../../../common/services/local-storage-service';
import { MapFeature, FeatureProperties, GlobalEntry } from '../data';
import { PathOptions, StyleFunction } from 'leaflet';

type GeoJSONFeature = any;

type FeatureCacheEntry = {
  provIstat: string;
  feature: GeoJSONFeature;
  polygons: Array<Array<[number, number]>>;
  bbox: { minLon: number; maxLon: number; minLat: number; maxLat: number };
};



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class LocationsMap implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapHost', { static: true }) mapHost!: ElementRef<HTMLDivElement>;

  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);

  @Input() geojson: FeatureCollection<MapFeature, FeatureProperties> | null = null;
  @Input() rankingOrder: GlobalEntry[] | null = null;
  @Input() persistenceKey: string | null = null;

  private map!: L.Map;
  private geoJsonLayer!: L.GeoJSON | null;
  private featureCache: Map<string, FeatureCacheEntry> = new Map();
  private rankMap: Record<string, number> = {};
  private totalRanks = 1;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    if (!this.rankingOrder && this.persistenceKey) {
      this.rankingOrder = this.localStorageService.getItem<GlobalEntry[]>(this.persistenceKey) ?? null;
    }

    this.ngZone.runOutsideAngular(() => {
      this.initializeMap();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['geojson'] && this.geojson) {
      this.addOrReplaceGeoJsonLayer();
    }
    if (changes['rankingOrder']) {
      // persist if needed and update ranking
      if (this.persistenceKey && this.rankingOrder) {
        try { this.localStorageService.setItem<GlobalEntry[]>(this.persistenceKey, this.rankingOrder); } catch {}
      }
      this.updateRanking(this.rankingOrder ?? null);
    }
  }

  ngOnDestroy(): void {
    if (this.map) { this.map.off(); this.map.remove(); }
  }

  // ---------- Map setup ----------
  private initializeMap() {
    const initialCenter: L.LatLngExpression = [42.5, 12.5];

    // Create map with interactions disabled so it's fixed
    this.map = L.map(this.mapHost.nativeElement, {
      center: initialCenter,
      zoom: 5,
      preferCanvas: true,
      attributionControl: false,
      zoomControl: false,   // hide controls
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tapHold: false,
      touchZoom: false,
      inertia: false
    });

    // OPTIONAL: ensure user cannot programmatically pan beyond bounds (double-safety)
    // we'll set bounds once features are added (in addOrReplaceGeoJsonLayer) using fitBounds + setMaxBounds

    // NOTE: No tile layer is added. Instead, the container background provides the "map" color.
    // If you previously added an OSM tile layer, remove that code.

    // If geojson already loaded, add layer
    if (this.geojson) this.addOrReplaceGeoJsonLayer();
  }

  // ---------- Layer & cache ----------
  private addOrReplaceGeoJsonLayer() {
    if (this.geoJsonLayer) {
      try { this.geoJsonLayer.remove(); } catch {}
      this.geoJsonLayer = null;
      this.featureCache.clear();
    }

    // use canvas renderer (Leaflet) - create renderer instance
    const renderer = L.canvas({ padding: 0.5 });

    // Build feature cache once and reuse the computed bbox returned by buildFeatureCache
    const overallBbox = this.buildFeatureCache(this.geojson!);

    // NOTE: GeoJSONOptions from @types/leaflet doesn't include `renderer` property in its type.
    // To avoid the "object literal may only specify known properties" error we cast options to `any`.
    const geoJsonOptions: any = {
      renderer,
      style: this.applyStyle,
      interactive: false
    };

    // Apply ranking if present (or empty default)
    this.updateRanking(this.rankingOrder ?? null);
    console.log(this.rankMap);
    // add to map
    this.geoJsonLayer = L.geoJSON(this.geojson as any, geoJsonOptions).addTo(this.map);
    // fit to bbox computed above
    if (overallBbox) {
      try {
        this.map.fitBounds([[overallBbox.minLat, overallBbox.minLon], [overallBbox.maxLat, overallBbox.maxLon]], { padding: [20, 20] });
      } catch (e) { /* ignore */ }

    }
  }

  /**
   * Build feature cache and returns the aggregated bbox for all features.
   * This avoids re-computing polygons/bboxes multiple times.
   */
  private buildFeatureCache(geojson: FeatureCollection<MapFeature, FeatureProperties>) {
    this.featureCache.clear();

    let aggMinLon = Infinity, aggMaxLon = -Infinity, aggMinLat = Infinity, aggMaxLat = -Infinity;

    const features = geojson.features || [];
    for (const feat of features) {
      // use numeric code if available (matching your FeatureProperties)
      const provRaw = feat.properties?.prov_istat_code_num ?? feat.id ?? null;
      if (provRaw === null || provRaw === undefined) continue;
      const prov = String(provRaw);

      const polygons = this.extractPolygonsFromGeometry(feat.geometry);
      const bbox = this.computeBboxFromPolygons(polygons);

      // store cache entry
      this.featureCache.set(prov, { provIstat: prov, feature: feat, polygons, bbox });

      // update aggregated bbox
      if (bbox.minLon < aggMinLon) aggMinLon = bbox.minLon;
      if (bbox.maxLon > aggMaxLon) aggMaxLon = bbox.maxLon;
      if (bbox.minLat < aggMinLat) aggMinLat = bbox.minLat;
      if (bbox.maxLat > aggMaxLat) aggMaxLat = bbox.maxLat;
    }

    // fallback defaults if nothing valid
    if (!isFinite(aggMinLon)) { aggMinLon = 6; aggMaxLon = 19; aggMinLat = 36; aggMaxLat = 47; }

    return { minLon: aggMinLon, maxLon: aggMaxLon, minLat: aggMinLat, maxLat: aggMaxLat };
  }

  private extractPolygonsFromGeometry(geometry: MapFeature): Array<Array<[number, number]>> {
    const out: Array<Array<[number, number]>> = [];
    if (!geometry) return out;
    const type = geometry.type;
    const coords = geometry.coordinates || [];

    const addRing = (ring: any[]) => {
      const r: Array<[number, number]> = [];
      for (const p of ring) r.push([p[0], p[1]]);
      if (r.length) out.push(r);
    };

    if (type === 'Polygon') {
      for (const ring of coords) addRing(ring);
    } else if (type === 'MultiPolygon') {
      for (const poly of coords) {
        for (const ring of poly) addRing(ring);
      }
    } else {
      console.warn('unhandled geometry type', type);
      for (const ring of coords) addRing(ring);
    }

    return out;
  }

  private computeBboxFromPolygons(polygons: Array<Array<[number, number]>>) {
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    for (const ring of polygons) {
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
    if (!isFinite(minLon)) { minLon = 6; maxLon = 19; minLat = 36; maxLat = 47; }
    return { minLon, maxLon, minLat, maxLat };
  }

  // ---------- Ranking & coloring ----------
  /**
   * Unified ranking updater. Accepts your GlobalEntry[] or null.
   * - If entries !== null and contain `rank`, we use those rank indexes.
   * - Otherwise we fallback to featureCache order.
   */
  public updateRanking(entries: GlobalEntry[] | null) {
    // If provided entries, persist them
    if (this.persistenceKey && entries) {
      try { this.localStorageService.setItem<GlobalEntry[]>(this.persistenceKey, entries); } catch {}
    }

    // Build ordered array `arr` where index = rank-1 -> prov (string)
    let arr: string[];
    if (Array.isArray(entries) && entries.length > 0) {
      // derive max rank (in case ranks are sparse / explicit)
      const maxRank = entries.reduce((m, e) => Math.max(m, e.rank ?? 0), 0) || entries.length;
      arr = new Array(maxRank);
      for (const e of entries) {
        if (e.rank >= 1 && e.rank <= maxRank) {
          arr[e.rank - 1] = String(e.locationCode);
        }
      }
    } else {
      // fallback: use feature cache order
      arr = Array.from(this.featureCache.keys());
    }

    // Build rankMap from arr
    this.rankMap = {};
    this.totalRanks = Math.max(1, arr.length);
    arr.forEach((prov, idx) => {
      if (prov !== undefined && prov !== null && prov !== '') this.rankMap[String(prov)] = idx + 1;
    });

    // apply styling to existing layer efficiently
    if (this.geoJsonLayer) {
      this.geoJsonLayer.setStyle(this.applyStyle as StyleFunction<FeatureProperties>);
    }
  }

  applyStyle(feature: Feature<GeometryObject, FeatureProperties>): PathOptions {
  // use numeric code property (as in your FeatureProperties)
  const prov = String(feature.properties?.prov_istat_code_num ?? (feature.id ?? ''));
  const rank = this.rankMap[prov] ?? this.totalRanks;
  const t = this.totalRanks > 1 ? (rank - 1) / (this.totalRanks - 1) : 0;

  return {
    // boundary / stroke
    color: '#000000',        // black boundaries
    weight: 1.0,             // stroke width (adjust as needed)
    opacity: 1.0,

    // fill (still uses ranking; set fillOpacity: 0 for no fill)
    fillColor: this.interpolateColorHex('#2ecc71', '#e74c3c', t),
    fillOpacity: 0.85,       // set to 0 if you want only outlines
    interactive: false
  } as L.PathOptions;
}

  // ---------- Color helpers ----------
  private interpolateColorHex(aHex: string, bHex: string, t: number) {
    const a = this.hexToRgb(aHex);
    const b = this.hexToRgb(bHex);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    return `rgb(${r},${g},${bl})`;
  }

  private hexToRgb(hex: string) {
    let s = hex.replace('#', '');
    if (s.length === 3) s = s.split('').map(ch => ch + ch).join('');
    const n = parseInt(s, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
}
