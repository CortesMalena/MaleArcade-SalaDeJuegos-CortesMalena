import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ResultadosService {


  constructor() {
  }

  // Me sirve para cualquier tipo de estadistica que contenga al usuario_id
  agruparPorUsuario <T extends { usuario_id: string }> (estadisticas: T[]) {
    
    const mejoresPartidas: T[] = [];

    for (const estadistica of estadisticas) {

      const yaExiste = mejoresPartidas.some(e => e.usuario_id === estadistica.usuario_id);
      
      if (!yaExiste) {
        mejoresPartidas.push(estadistica);
      }
    }

    return mejoresPartidas
  }

}
