import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRecetteComponent } from './search-recette.component';

describe('SearchRecetteComponent', () => {
  let component: SearchRecetteComponent;
  let fixture: ComponentFixture<SearchRecetteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRecetteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRecetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
