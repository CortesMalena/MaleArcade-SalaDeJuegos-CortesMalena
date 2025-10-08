import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosPreguntados } from './resultados-preguntados';

describe('ResultadosPreguntados', () => {
  let component: ResultadosPreguntados;
  let fixture: ComponentFixture<ResultadosPreguntados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosPreguntados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosPreguntados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
