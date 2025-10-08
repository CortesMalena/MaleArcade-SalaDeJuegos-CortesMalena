import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarElTesoro } from './buscar-el-tesoro';

describe('BuscarElTesoro', () => {
  let component: BuscarElTesoro;
  let fixture: ComponentFixture<BuscarElTesoro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarElTesoro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarElTesoro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
