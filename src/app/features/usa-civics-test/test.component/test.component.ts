import { Component, inject, OnInit, output } from '@angular/core';
import { UscisPdfParser } from '../uscis-pdf-parser';

@Component({
  selector: 'app-test.component',
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  private readonly parser: UscisPdfParser = inject(UscisPdfParser);

  ngOnInit(): void {
    this.parser.getPdf().then();
  }

}
