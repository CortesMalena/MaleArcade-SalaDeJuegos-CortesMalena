import { Component, signal, OnInit } from '@angular/core';

// Interfaz 
import { EstadisticaBusquedaDelTesoro } from '../../../interfaces/interfaces';

import { JuegosService } from '../../../services/juegos-service';
import { ResultadosService } from '../../../services/resultados-service';
import { SweetAlertService } from '../../../modals/sweet-alert';

import { DatePipe } from '@angular/common';
import { HoverScale } from '../../../directives/hover-scale';

@Component({
  selector: 'app-resultados-busqueda-del-tesoro',
  imports: [DatePipe, HoverScale],
  templateUrl: './resultados-busqueda-del-tesoro.html',
  styleUrl: './resultados-busqueda-del-tesoro.css'
})
export class ResultadosBusquedaDelTesoro implements OnInit {

  ranking = signal<EstadisticaBusquedaDelTesoro[]>([]);
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
      const datosEstadisticas = await this.juegosService.obtenerEstadisticasBusquedaDelTesoro(); 

      if (!datosEstadisticas) return;

      this.ranking.set(this.resultadoService.agruparPorUsuario(datosEstadisticas));
      this.cargando.set(false);
    } catch (error: any) {
      this.sweetAlert.crearMensajeError("Ocurrio un error cargando el ranking, intentalo más tarde"); 
      console.error(error.message); 
      this.cargando.set(false);
    }

  }

}

