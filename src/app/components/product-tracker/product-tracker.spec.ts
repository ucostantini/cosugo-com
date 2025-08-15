import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTracker } from './product-tracker';

describe('ProductTracker', () => {
  let component: ProductTracker;
  let fixture: ComponentFixture<ProductTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTracker]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductTracker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
