import { Component, Input } from '@angular/core';
import { GlobalEntry } from '../core/data';

@Component({
  selector: 'app-ranking',
  imports: [],
  templateUrl: './ranking.html',
  styleUrl: './ranking.scss'
})
export class Ranking {
  @Input() globalRanking: GlobalEntry[] = [];

}
