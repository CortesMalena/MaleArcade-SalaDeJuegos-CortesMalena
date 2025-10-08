import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosMayorOMenor } from './resultados-mayor-o-menor';

describe('ResultadosMayorOMenor', () => {
  let component: ResultadosMayorOMenor;
  let fixture: ComponentFixture<ResultadosMayorOMenor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosMayorOMenor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosMayorOMenor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
