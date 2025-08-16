import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../data';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductForm {
  submitEvent = output<Product>();

  private readonly fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: this.fb.control(null, {nonNullable: true}),
    price: this.fb.control(null, {nonNullable: true}),
    weight: this.fb.control(null, {nonNullable: true}),
    servingSize: this.fb.control(null, {nonNullable: true}),
    calories: this.fb.control(null, {nonNullable: true}),
    proteins: this.fb.control(null, {nonNullable: true}),
  });

  onSubmit(): void {
    this.submitEvent.emit(this.form.value as Product);
    this.form.reset();
  }
}
