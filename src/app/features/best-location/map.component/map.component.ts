import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { GlobalEntry, MapFeature, FeatureProperties } from '../data';
import * as d3 from 'd3';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class LocationsMap implements OnChanges {
  @Input() geojson: FeatureCollection<MapFeature, FeatureProperties> | null = null;
  @Input() rankingOrder: GlobalEntry[] | null = null;

  // SVG dimensions
  width = 100;
  height = 100;

  pathGenerator: d3.GeoPath | null = null;
  private readonly rankMap: Map<string, number> = new Map();
  private totalRanks = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.geojson && (changes['geojson'] || !this.pathGenerator)) {
      this.fixData(this.geojson);
      this.setupMapProjection();
    }
    if (changes['rankingOrder'] || (this.geojson && changes['geojson'])) {
      this.updateRanking();
    }
  }

  private setupMapProjection(): void {
    if (!this.geojson) return;

    // Use a Mercator projection
    const projection = d3.geoMercator()
      .fitSize([this.width, this.height], this.geojson as any);

    // Create a path generator using the projection
    this.pathGenerator = d3.geoPath().projection(projection);
  }

  private fixData(geojson: FeatureCollection<MapFeature, FeatureProperties>): void {
    geojson.features.forEach(feature => {
      const geom = feature.geometry;
      if (geom?.type === 'MultiPolygon') {
        geom.coordinates.forEach(polygon => {
          const exteriorRing = polygon[0];
          if (d3.polygonArea(exteriorRing as [number, number][]) < 0) {
            exteriorRing.reverse();
          }
        });
      } else if (geom?.type === 'Polygon') {
        const exteriorRing = geom.coordinates[0];
        if (d3.polygonArea(exteriorRing as [number, number][]) < 0) {
          exteriorRing.reverse();
        }
      }
    });
  }


  private updateRanking(): void {
    this.rankMap.clear();
    if (!this.rankingOrder || this.rankingOrder.length === 0) {
      this.totalRanks = this.geojson?.features.length ?? 1;
      this.geojson?.features.forEach((feature, index) => {
        const provId = String(feature.properties?.prov_istat_code_num ?? feature.id ?? '');
        if (provId) {
          this.rankMap.set(provId, index + 1);
        }
      });
      return;
    }

    this.totalRanks = this.rankingOrder.reduce((max, e) => Math.max(max, e.rank ?? 0), 0);
    for (const entry of this.rankingOrder) {
      this.rankMap.set(String(entry.locationCode), entry.rank ?? 0);
    }
    this.totalRanks = Math.max(1, this.totalRanks);
  }

  // Method called from the template to generate the 'd' attribute for each path
  getFeaturePath(feature: Feature<MapFeature, FeatureProperties>): string {
    return this.pathGenerator ? this.pathGenerator(feature as any) ?? '' : '';
  }

  // Method to determine the fill color based on rank
  getFillColor(feature: Feature<MapFeature, FeatureProperties>): string {
    const provId = String(feature.properties?.prov_istat_code_num ?? (feature.id ?? ''));
    const rank = this.rankMap.get(provId) ?? this.totalRanks;
    const t = this.totalRanks > 1 ? (rank - 1) / (this.totalRanks - 1) : 0;
    // Interpolate from green to red
    return d3.interpolateRgb("#2ecc71", "#e74c3c")(t);
  }
}
