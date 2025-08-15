import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../features/product-nutrition-comparison/data';

@Component({
  selector: 'app-product-tracker',
  imports: [ReactiveFormsModule],
  templateUrl: './product-tracker.html',
  styleUrl: './product-tracker.scss'
})
export class ProductTracker {
  submitEvent = output<Product>();

  private readonly fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: this.fb.control(null, {nonNullable: true}),
    price: this.fb.control(null, {nonNullable: true}),
    servingSize: this.fb.control(null, {nonNullable: true}),
    calories: this.fb.control(null, {nonNullable: true}),
    proteins: this.fb.control(null, {nonNullable: true}),
  });

  onSubmit(): void {
    this.submitEvent.emit(this.form.value as Product);
  }
}
