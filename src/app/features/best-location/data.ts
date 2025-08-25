import { FormControl } from '@angular/forms';
import { MultiPolygon, Polygon } from 'geojson';

export type QDV = Map<Categoria, Indicatore[]>;

export type Categoria = string;

export type Header = "NOME PROVINCIA (ISTAT)" | "CODICE NUTS 3 2021" | "CODICE PROVINCIA ISTAT (STORICO)" | "DENOMINAZIONE CORRENTE" | "CATEGORIA" | "VALORE" | "INDICATORE" | "UNITA' DI MISURA" | "ANNO DI RIFERIMENTO DEI DATI" | "FONTE";

export type Valore = {
  min: number;
  max: number;
  unit: string;
}


export type Indicatore = {
  isSelected: boolean;
  categoria: string;
  name: string;
  min: number;
  max: number;
  coefficiente: number;
  valore: number;
  unit: string;
}


export type CategoriaScore = Map<Categoria, IndicatoreScore>;

export type IndicatoreScore = Map<IndicatoreKey, Score>;

export type IndicatoreKey = string;

export type Score = {
  categoria: string;
  indicatore: string;
  coefficiente: number;
  valore: number;
}

export type ProvinciaValore = {
  provincia: string;
  categoria: string;
  indicatore: string;
  valore: number;
}

// TODO just return the list of provinces
export type Valori = Map<IndicatoreKey, ProvinciaValore[]>;

export type Ranking = Map<Provincia, number>

export type Provincia = string;

export type RankingScore = {

}


export interface IndicatoreForm {
  categoria: string;
  indicatore: string;
  min: number;
  max: number;
  unit: string;
  isSelected: FormControl<boolean>;
  coeff: FormControl<number>;
  valore: FormControl<number>;
}

export type ScoreForm = {
  isSelected: boolean;
  score: Score;
};

export type IndicatorValues = Map<string, { location: Provincia; locationCode: string; avgValue: number }[]>;

// set of known locations (useful to enumerate all locations)
export type Locations = Set<Provincia>;

export type DbScore = {
  indicatorValues: IndicatorValues;
  locations: Locations;
}

export type PerIndicatorEntry = {
  category: Categoria;
  indicator: IndicatoreKey;
  location: Provincia;
  avgValue: number;
  score: number;
  rank?: number;
};

export type PerCategoryEntry = {
  category: Categoria;
  location: Provincia;
  compositeScore: number;
  rank?: number;
};

export type GlobalEntry = {
  location: Provincia;
  locationCode: string;
  compositeScore: number;
  rank: number;
};


export type MapFeature = Polygon | MultiPolygon;
export type FeatureProperties = {
  "prov_name": string,
  "prov_istat_code_num": number,
  "prov_acr": string,
  "reg_name": string,
  "reg_istat_code": string,
  "reg_istat_code_num": number,
  "prov_istat_code": string
}


