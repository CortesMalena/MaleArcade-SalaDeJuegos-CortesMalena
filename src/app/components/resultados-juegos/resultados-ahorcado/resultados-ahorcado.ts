import { Component, signal, OnInit } from '@angular/core';

import { JuegosService } from '../../../services/juegos-service';
import { ResultadosService } from '../../../services/resultados-service';
import { EstadisticasAhorcado } from '../../../interfaces/interfaces';

import { SweetAlertService } from '../../../modals/sweet-alert';
import { DatePipe } from '@angular/common';
import { HoverScale } from '../../../directives/hover-scale';

@Component({
  selector: 'app-resultados-ahorcado',
  imports: [DatePipe, HoverScale],
  templateUrl: './resultados-ahorcado.html',
  styleUrl: './resultados-ahorcado.css'
})
export class ResultadosAhorcado implements OnInit {
  ranking = signal<EstadisticasAhorcado[]>([]);
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
      const datosEstadisticas = await this.juegosService.obtenerEstadisticasAhorcado(); 

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

