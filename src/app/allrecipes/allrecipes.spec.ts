import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allrecipes } from './allrecipes';

describe('Allrecipes', () => {
  let component: Allrecipes;
  let fixture: ComponentFixture<Allrecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allrecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Allrecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
