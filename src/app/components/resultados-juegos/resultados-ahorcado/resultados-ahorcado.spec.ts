import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosAhorcado } from './resultados-ahorcado';

describe('ResultadosAhorcado', () => {
  let component: ResultadosAhorcado;
  let fixture: ComponentFixture<ResultadosAhorcado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosAhorcado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosAhorcado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
