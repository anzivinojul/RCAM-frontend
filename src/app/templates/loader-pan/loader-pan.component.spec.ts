import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderPanComponent } from './loader-pan.component';

describe('LoaderComponent', () => {
  let component: LoaderPanComponent;
  let fixture: ComponentFixture<LoaderPanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderPanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderPanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
