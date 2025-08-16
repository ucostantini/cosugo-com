import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../data';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, NgClass],
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

  get price() {
    return this.form.get('price');
  }

  get weight() {
    return this.form.get('weight');
  }

  get servingSize() {
    return this.form.get('servingSize');
  }

  get calories() {
    return this.form.get('calories');
  }

  get proteins() {
    return this.form.get('proteins');
  }

  priceInvalid(): boolean | undefined {
    return this.price?.invalid && (this.price?.dirty || this.price?.touched)
  }

  weightInvalid(): boolean | undefined {
    return this.weight?.invalid && (this.weight?.dirty || this.weight?.touched)
  }

  servingSizeInvalid(): boolean | undefined {
    return this.servingSize?.invalid && (this.servingSize?.dirty || this.servingSize?.touched)
  }

  caloriesInvalid(): boolean | undefined {
    return this.calories?.invalid && (this.calories?.dirty || this.calories?.touched)
  }

  proteinsInvalid(): boolean | undefined {
    return this.proteins?.invalid && (this.proteins?.dirty || this.proteins?.touched)
  }
}
