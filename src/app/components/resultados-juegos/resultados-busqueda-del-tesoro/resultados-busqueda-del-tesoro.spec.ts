import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosBusquedaDelTesoro } from './resultados-busqueda-del-tesoro';

describe('ResultadosBusquedaDelTesoro', () => {
  let component: ResultadosBusquedaDelTesoro;
  let fixture: ComponentFixture<ResultadosBusquedaDelTesoro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosBusquedaDelTesoro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosBusquedaDelTesoro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
