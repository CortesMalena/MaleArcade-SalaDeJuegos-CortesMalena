import { Component, OnInit, OnDestroy, signal} from '@angular/core';

// Dependencias reactivas 
import { interval } from 'rxjs';

// Servicos preguntados 
import { PreguntadosService } from '../../../services/preguntados-service';
import { Pregunta, Opcion } from '../../../interfaces/interfaces';

import { Router } from '@angular/router';

// Modales 
import { SweetAlertService } from '../../../modals/sweet-alert';
import { Supabase } from '../../../services/supabase';

import { EstadisticaPreguntados } from '../../../interfaces/interfaces';
import { JuegosService } from '../../../services/juegos-service';

@Component({
  selector: 'app-preguntados',
  imports: [],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.css']
})
export class Preguntados implements OnInit, OnDestroy {

  // Relacionado a las preguntas 
  todasLasPreguntas: Pregunta[] = [];
  preguntaActual?: Pregunta;
  preguntasRestantes: Pregunta[] = [];

  // Jugabilidad 
  cargando = signal(false);
  puntos = signal(0);
  tiemposRespuestasCorrectas: number[] = [];
  cantidadRespuestasCorrectas= 0;

  // Tiempo 
  suscripcion: any;
  tiempo = signal(0);
  limite = 10;

  // estadistica ppreguntados
  estadistica: EstadisticaPreguntados = {
    usuario_id: "", 
    nombre_usuario: "",
    mail_usuario: "",   
    puntos: 0,
    tiempo_promedio: 0,
    respuestas_correctas: 0
  }

  // opcion correcta para informar al final 
  opcionCorrectaNoElegida: Opcion | undefined;

  constructor (private preguntadosService: PreguntadosService, private router: Router, private sweetAlert: SweetAlertService, private supabase: Supabase, private juegosService: JuegosService) { }

  ngOnInit() {

    try {
      this.cargando.set(true);
      this.preguntadosService.getPreguntas().subscribe(data => {
      this.todasLasPreguntas = data;
      
      this.iniciarJuego();
    });
    } catch (error) {
      this.sweetAlert.crearMensajeError('Error al cargar las preguntas. Inténtalo de nuevo más tarde.');
      this.router.navigate(['/']);
    }

  }

  ngOnDestroy() {
    // Evito memory leaks (lo que hace que la aplicación consuma más memoria de la necesaria)
    this.suscripcion?.unsubscribe();
  }


  iniciarJuego() {

    this.preguntasRestantes = [...this.todasLasPreguntas];
    this.cargando.set(false);

    this.puntos.set(0);
    this.tiempo.set(0);
    this.pasarSiguientePregunta();

  }

  iniciarTiempo() {
    if (this.suscripcion) this.suscripcion.unsubscribe();

    this.suscripcion = interval(1000).subscribe(() => {
      this.tiempo.set(this.tiempo() + 1);
      
      // Si llego al limite me desuscribo y finalizo el juego 
      if (this.tiempo() >= this.limite) {
        this.suscripcion.unsubscribe();

        this.finalizarJuego();
      }
    });
  }

  responderOpcion (opcion: Opcion) {
    if (opcion.correcta) {
      this.puntos.set(this.puntos() + 20);
      const tiempoRespuesta = this.tiempo(); // tiempo actual en segundos
      this.tiemposRespuestasCorrectas.push(tiempoRespuesta);
      this.cantidadRespuestasCorrectas++;
    } else {
      const respuestaCorrecta = this.preguntaActual?.opciones.find(o => o.correcta);
      this.opcionCorrectaNoElegida = respuestaCorrecta;
      this.finalizarJuego()
      return;
    }

    this.pasarSiguientePregunta();
  }

  
  pasarSiguientePregunta() {


    if (this.preguntasRestantes.length === 0) {
      this.finalizarJuego();
      return;
    }
    
    // Elegir índice random
    const indiceRandom = Math.floor(Math.random() * this.preguntasRestantes.length);
    this.preguntaActual = this.preguntasRestantes.splice(indiceRandom, 1)[0];

    // Mezclar opciones 
    this.preguntaActual.opciones = this.preguntaActual.opciones.sort(() => Math.random() - 0.5);

    this.tiempo.set(0);
    // me desuscribo de la anterior suscripcion 
    this.suscripcion?.unsubscribe();
    this.iniciarTiempo();
  }

  async finalizarJuego() {
    const sumaTiempos = this.tiemposRespuestasCorrectas.reduce((acc, t) => acc + t, 0);
    const promedio = this.tiemposRespuestasCorrectas.length > 0 ? sumaTiempos / this.tiemposRespuestasCorrectas.length : 0;

    try {
      // Obtengo la informacion del usuario
      const usuarioData = await this.supabase.getUser(); 

      if (usuarioData) {
        // establezco estadisticas
        this.estadistica.usuario_id = usuarioData.id
        this.estadistica.nombre_usuario = usuarioData.user_metadata['nombre']
        this.estadistica.mail_usuario = usuarioData.email! 
        this.estadistica.puntos = this.puntos();
        this.estadistica.tiempo_promedio = promedio; 
        this.estadistica.respuestas_correctas = this.cantidadRespuestasCorrectas;

    
        // Guardo los datos 
        if (await this.juegosService.guardarDatosPreguntados(this.estadistica)) {
          this.sweetAlert.crearMensajeJuego(`¡Termino! Acertaste ${this.cantidadRespuestasCorrectas} preguntas y obtuviste ${this.puntos()} puntos.`, ` La respuesta era: ${this.opcionCorrectaNoElegida!.texto.toLocaleUpperCase()}. ¡Gracias por jugar! sus datos se encuentran guardados`);
          this.router.navigate(['/']);
        }
      }
      
    } catch (error: any) {
      // manejo errores
      this.sweetAlert.crearMensajeError(`Error al insertar estadisticas`);
      console.error(error.message);
      this.router.navigate(['/']);
    }

  }

}
