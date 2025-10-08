import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaPersonalizada'
})
export class FechaPersonalizadaPipe implements PipeTransform {

  transform(value: Date | string | null | undefined): string {
    
    if (!value) return '';
    
    const fechaAMedir = new Date(value);
    const fechaActual = new Date();
    const diferenciaTiempo = fechaActual.getTime() - fechaAMedir.getTime();


    const segundos = Math.floor(diferenciaTiempo / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const semanas = Math.floor(dias / 7);
    
    let retorno = "";
    const hora = fechaAMedir.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });


    if (segundos < 60) {
      retorno = 'hace un momento';
    } else if (minutos < 60) {
      retorno = `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    } else if (horas < 24) {
      retorno = ` hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    } else if (dias === 1) {
      retorno =`ayer a las ${hora} ${horas === 1 ? 'hora' : 'horas'}`;
    } else if (dias < 7) {
      const diaSemana = fechaAMedir.toLocaleDateString('es-ES', { weekday: 'long' });
      retorno = `${diaSemana} a las ${hora}  ${horas === 1 ? 'hora' : 'horas'}`;
    } else  {
      retorno =`hace ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`;
    } 

    if (dias >= 7 ) {
        return this.formatoFechaCompleta(fechaAMedir) + `, ${hora}`;
    }



    return retorno;
  }

   private formatoFechaCompleta(fecha: Date): string {
      return fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
      });
}
}