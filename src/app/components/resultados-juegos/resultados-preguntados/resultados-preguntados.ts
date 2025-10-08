import { Component, signal} from '@angular/core';

import { JuegosService } from '../../../services/juegos-service';
import { ResultadosService } from '../../../services/resultados-service';
import { SweetAlertService } from '../../../modals/sweet-alert';

import { EstadisticaPreguntados } from '../../../interfaces/interfaces';

import { HoverScale } from '../../../directives/hover-scale';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resultados-preguntados',
  imports: [DatePipe, HoverScale],
  templateUrl: './resultados-preguntados.html',
  styleUrl: './resultados-preguntados.css'
})
export class ResultadosPreguntados {
  ranking = signal<EstadisticaPreguntados[]>([]);
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
      const datosEstadisticas = await this.juegosService.obtenerEstadisticasPreguntados(); 

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
