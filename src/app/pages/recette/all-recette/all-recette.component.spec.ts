import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecetteComponent } from './all-recette.component';

describe('AllRecetteComponent', () => {
  let component: AllRecetteComponent;
  let fixture: ComponentFixture<AllRecetteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRecetteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRecetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
