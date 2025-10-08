import { Component, signal } from '@angular/core';

import { JuegosService } from '../../../services/juegos-service';
import { ResultadosService } from '../../../services/resultados-service';
import { EstadisticaMayorOMenor } from '../../../interfaces/interfaces';

import { SweetAlertService } from '../../../modals/sweet-alert';

import { DatePipe } from '@angular/common';
import { HoverScale } from '../../../directives/hover-scale';

@Component({
  selector: 'app-resultados-mayor-o-menor',
  imports: [DatePipe, HoverScale],
  templateUrl: './resultados-mayor-o-menor.html',
  styleUrl: './resultados-mayor-o-menor.css'
})
export class ResultadosMayorOMenor {
  ranking = signal<EstadisticaMayorOMenor[]>([]);
  cargando = signal(false);

  constructor(
    private juegosService: JuegosService,
    private resultadoService: ResultadosService,
    private sweetAlert: SweetAlertService
  ) {}

  async ngOnInit() {

   this.cargarEstadisticasAhorcado();
  }

  async cargarEstadisticasAhorcado () {
    try {
      this.cargando.set(true);
      const datosEstadisticas = await this.juegosService.obtenerEstadisticasMayorOMenor(); 

      if (!datosEstadisticas) return;

      this.ranking.set(this.resultadoService.agruparPorUsuario(datosEstadisticas));
      this.cargando.set(false);
    } catch (error: any) {
      this.sweetAlert.crearMensajeError("Ocurrio un error cargando el ranking, intentalo mas tarde"); 
      console.error(error.message); 
      this.cargando.set(false);
    }

  }

}
