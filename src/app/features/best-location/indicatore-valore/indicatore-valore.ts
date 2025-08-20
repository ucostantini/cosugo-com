import { Component, inject, Input, OnDestroy, OnInit, output, Output } from '@angular/core';
import { Indicatore, IndicatoreForm, IndicatoreKey, IndicatoreScore, Score, ScoreForm } from '../core/data';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GovukSlider } from '../govuk-slider/govuk-slider';
import { Counter } from '../counter/counter';
import { Subject, takeUntil } from 'rxjs';
import * as console from 'node:console';

@Component({
  selector: 'app-indicatore-valore',
  imports: [
    ReactiveFormsModule,
    GovukSlider,
    Counter
  ],
  templateUrl: './indicatore-valore.html',
  styleUrl: './indicatore-valore.scss'
})
export class IndicatoreValore implements OnInit, OnDestroy {
  @Input() index!: number;
  @Input() indicatori!: Indicatore[];
  scoreChangeEvent = output<Indicatore>();

  private readonly fb: FormBuilder = inject(FormBuilder);

  form: FormGroup | undefined;

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form = this.fb.group({
      indicatori: this.fb.array(this.indicatori
        .map((val: Indicatore) => this.fb.group<IndicatoreForm>({
            categoria: val.categoria,
            indicatore: val.name,
            min: val.min,
            max: val.max,
            unit: val.unit,
            isSelected: this.fb.control(val.isSelected, {nonNullable: true}),
            coeff: this.fb.control(val.coefficiente, {nonNullable: true}),
            valore: this.fb.control(val.valore, {nonNullable: true})
          })
        ))
    });

    (this.form.get('indicatori') as FormArray).controls.forEach((control: AbstractControl) => {
      control.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe(value => {
        this.updateScore(value);
      });
    });
  }

  private updateScore(value: any): void {
    this.scoreChangeEvent.emit({
      isSelected: value.isSelected,
      categoria: value.categoria,
      name: value.indicatore,
      coefficiente: value.coeff,
      valore: value.valore,
      unit: value.unita
    } as Indicatore);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
