import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-govuk-slider',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GovukSlider),
      multi: true
    }
  ],
  templateUrl: './govuk-slider.html',
  styleUrl: './govuk-slider.scss'
})
export class GovukSlider implements ControlValueAccessor {
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() value: number = 0;

  propagateChange = (_: any) => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.value = Number((obj as number).toFixed(2));
  }

  onUpdate($event: Event) {
    this.value = Number(Number(($event.target as HTMLInputElement).value).toFixed(2));
    this.propagateChange(this.value);
  }

}
