import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-counter',
    imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Counter),
      multi: true
    }
    ],
  templateUrl: './counter.html',
  styleUrl: './counter.scss'
})
export class Counter implements ControlValueAccessor {
  @Input() _value: number = 1;

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
    this.propagateChange(val);
  }

  decrement(): void {
    this.value--;
  }

  increment(): void {
    this.value++;
  }

  private propagateChange = (_: any) => {};

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
}
