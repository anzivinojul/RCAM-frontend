import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderPotComponent } from './loader-pot.component';

describe('LoaderPotComponent', () => {
  let component: LoaderPotComponent;
  let fixture: ComponentFixture<LoaderPotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderPotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderPotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
