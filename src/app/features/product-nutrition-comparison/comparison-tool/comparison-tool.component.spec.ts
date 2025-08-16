import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonTool } from './comparison-tool.component';

describe('ProductNutritionComparison', () => {
  let component: ComparisonTool;
  let fixture: ComponentFixture<ComparisonTool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonTool]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ComparisonTool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
