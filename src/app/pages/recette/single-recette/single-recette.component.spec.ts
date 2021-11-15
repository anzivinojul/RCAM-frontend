import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRecetteComponent } from './single-recette.component';

describe('SingleRecetteComponent', () => {
  let component: SingleRecetteComponent;
  let fixture: ComponentFixture<SingleRecetteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleRecetteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRecetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
