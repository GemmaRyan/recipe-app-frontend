import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecipes } from './edit-recipes';

describe('EditRecipes', () => {
  let component: EditRecipes;
  let fixture: ComponentFixture<EditRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
