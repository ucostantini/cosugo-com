import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestLocationComponent } from './best-location.component';

describe('BestLocationComponent', () => {
  let component: BestLocationComponent;
  let fixture: ComponentFixture<BestLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
