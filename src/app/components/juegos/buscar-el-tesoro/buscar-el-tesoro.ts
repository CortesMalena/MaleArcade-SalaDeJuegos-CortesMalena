import { Component, signal, OnInit } from '@angular/core';

import { Supabase } from '../../../services/supabase';
import { Router } from '@angular/router';
import { JuegosService } from '../../../services/juegos-service';

import { SweetAlertService } from '../../../modals/sweet-alert';

// Dependencias reactivas 
import { interval, Subscription } from 'rxjs';

// interfaces 
import { EstadisticaBusquedaDelTesoro } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-buscar-el-tesoro',
  imports: [],
  templateUrl: './buscar-el-tesoro.html',
  styleUrl: './buscar-el-tesoro.css'
})
export class BuscarElTesoro implements OnInit{

  // Establezco las filas y columnas 
  filas = 5; 
  columnas = 5; 

  // Ubicación del tesoro 
  tesoroFila = 0; 
  tesoroCol = 0;

  // Ubicación de las bombas 
  cantBombas = 5;
  bombas: { fila:number, col: number}[] = []; 

  // Posición del jugador
  jugadorFila = 0;
  jugadorCol = 0;

  // Camino seguro para ir al Tesoro
  caminoSeguro: {fila:number, col:number} [] = []

  // Informacion del juego 
  cargando = signal(false);
  mensaje = signal("");
  mensajeTesoro = signal("");
  mensajeBomba = signal("");
  cantidadVidas = 3;
  vidas = signal(0)
  puntos = signal(0); 
  tiempo = signal(0); 
  limite = signal(250)
  juegoFinalizado = signal(false); 

  // cantidad de movimientos 
  cantidadMovimientos = 0;

  // Guardo la suscripcion para desuscribirme mas tarde 
  private suscripcion!: Subscription;

  estadistica: EstadisticaBusquedaDelTesoro = {
    usuario_id: "", 
    nombre_usuario: "",
    mail_usuario: "",   
    gano: false,
    puntos: 0,
    vidas_restantes: 0,
    tiempo: 0, 
    cantidad_movimientos: 0,  
  }

  constructor (private sweetAlert: SweetAlertService, private supabase: Supabase, private juegosService: JuegosService,
    private router: Router) {}

  ngOnInit() {
    this.inicializarJuego();

    this.suscripcion = interval(1000).subscribe(() => {
    this.tiempo.set(this.tiempo() + 1);
    
    // Si llego al limite me desuscribo y finalizo el juego 
    if (this.juegoFinalizado() || this.tiempo() >= this.limite()) {
      this.guardarEstadisticas(false);
    }
  });
  }

  ngOnDestroy () {
    this.suscripcion.unsubscribe();
  }

  inicializarJuego() {

    this.actualizarJuego();

    this.cargando.set(true);
    this.mensaje.set("¡Encuentra el tesoro!"); 

    // Tesoro
    this.crearTesoro(); 

    // Test del tesoro
    console.log(this.tesoroFila, this.tesoroCol); 

    // Camino seguro al tesoro
    this.crearCaminoSeguro()

    // Bombas
    this.crearBombas()

    // Test de bombas
    console.log(this.bombas); 

    this.obtenerPistas();
    this.cargando.set(false)
  }

  crearCaminoSeguro() {
    let f = 0, c = 0;

    this.caminoSeguro.push({fila:f, col:c});

    while (f !== this.tesoroFila || c !== this.tesoroCol) {
      // decidir movimiento aleatorio hacia el tesoro
      if (f < this.tesoroFila && Math.random() < 0.5) f++;          // ir abajo
      else if (f > this.tesoroFila) f--;                             // ir arriba
      else if (c < this.tesoroCol) c++;                              // ir derecha
      else if (c > this.tesoroCol) c--;                              // ir izquierda

      this.caminoSeguro.push({fila:f, col:c});
    }
  }

  crearTesoro() {
    // Posicion del tesoro
    do {
    this.tesoroFila = Math.floor(Math.random() * this.filas);
    this.tesoroCol = Math.floor(Math.random() * this.columnas);
    } while (this.tesoroFila === 0 && this.tesoroCol === 0);
  }

  crearBombas() {
    while (this.bombas.length < this.cantBombas) {

      // Posicion bomba 
      const fila = Math.floor(Math.random() * this.filas);
      const col = Math.floor(Math.random() * this.columnas);

      // Que la bomba no este en el tesoro
      if ((fila !== this.tesoroFila || col !== this.tesoroCol) &&
          (fila !== 0 || col !== 0) &&          
          !(this.caminoSeguro.some(c => c.fila === fila && c.col === col)) &&
          !(this.bombas.some(b => b.fila === fila  && b.col === col)))  {
        this.bombas.push({ fila, col });
      }
    }
  }

  actualizarJuego() {
    this.bombas = []; 
    this.vidas.set(this.cantidadVidas);
  }

  mover(direccion:string) {

    this.cantidadMovimientos++;

    this.mensaje.set("Sigue buscando...");

    switch (direccion) {

      case "arriba":
        if (this.jugadorFila > 0) {
          this.jugadorFila--; 
        }
        break; 

      case "abajo":
        if (this.jugadorFila < this.filas - 1 ) {
          this.jugadorFila++; 
        }
        break;

      case "izquierda": 
        if (this.jugadorCol > 0) {
          this.jugadorCol --;
        }
        break;

      case "derecha": 
        if(this.jugadorCol < this.columnas - 1 ) {
          this.jugadorCol++;
        }
        break;
    }

    this.obtenerPistas()
    this.verificarPosicion();
  }

  obtenerPistas() {
    this.mensajeTesoro.set(this.obtenerPistaTesoro());
    this.mensajeBomba.set(this.obtenerPistaBomba());
  }

  obtenerPistaTesoro() {
    const distancia = Math.abs(this.jugadorFila - this.tesoroFila) 
    + Math.abs(this.jugadorCol - this.tesoroCol);

    let retorno = "El tesoro está a MÁS de 3 pasos"

    if (distancia === 1) retorno = "El tesoro está a 1 paso";
    if (distancia === 2) retorno = "El tesoro está a 2 pasos ";
    if (distancia === 3) retorno = "El tesoro está a 3 pasos ";

    return retorno;
  }

  obtenerPistaBomba(): string {

    // Distancia de todas las bombas 
    const distancias = this.bombas.map(b => 
      Math.abs(this.jugadorFila - b.fila) + Math.abs(this.jugadorCol - b.col)
    );

    // Minimo de distancia
    const distanciaMin = Math.min(...distancias);

    let retorno = "No tienes bombas cerca";


    // Aviso según distancia
    if (distanciaMin === 1) retorno = '¡Cuidado! La bomba más cercana está a 1 paso ⚠️';
    if (distanciaMin === 2) retorno = '¡Cuidado! La bomba más cercana está a 2 pasos ⚠️';
    if (distanciaMin === 3) retorno = '¡Cuidado! La bomba más cercana está a 3 pasos ⚠️';

    return retorno;
}

  async verificarPosicion() {
    // Tesoro
    if (this.jugadorFila === this.tesoroFila && this.jugadorCol === this.tesoroCol) {
      this.puntos.set(this.puntos() + 50)
      this.guardarEstadisticas(true);
    }

    // Bombas
    for (let bomba of this.bombas) {
      if (this.jugadorFila === bomba.fila && this.jugadorCol === bomba.col) {
        this.mensajeBomba.set('¡PISASTE UNA BOMBA! -10 puntos');
        this.vidas.set(this.vidas() - 1);
        this.puntos.set(this.puntos() - 10)
      }
    }

    if (this.vidas() === 0) {
      this.guardarEstadisticas(false);
    }

  }

  async guardarEstadisticas(gano: boolean) {

    if (this.suscripcion && !this.suscripcion.closed) {
      this.suscripcion.unsubscribe();
    }

    this.juegoFinalizado.set(true); 
    // resta 1 punto por cada vez que te moves 
    if (this.puntos() < 0) {
      this.puntos.set(0);
    }
    this.puntos.set(this.puntos() + Math.max(0, 20 - this.cantidadMovimientos));


    let mensaje = `¡Opss Perdiste! obtuviste ${this.puntos()} puntos`;
    if (gano) {
      mensaje = `¡Ganaste! obtuviste ${this.puntos()} puntos`;
    }

    if (!gano && this.tiempo() >= this.limite()) {
      mensaje = `Tardaste mucho tiempo.`;
    }

    try {
      // obtengo el usuario 
      const usuarioData = await this.supabase.getUser(); 

      if (usuarioData) {
        // Actualizo las estadisticas 
        
        this.estadistica.usuario_id = usuarioData.id
        this.estadistica.nombre_usuario = usuarioData.user_metadata['nombre']
        this.estadistica.mail_usuario = usuarioData.email! 
        this.estadistica.gano = gano;
        this.estadistica.puntos = this.puntos();
        this.estadistica.vidas_restantes = this.vidas(); 
        this.estadistica.tiempo = this.tiempo(); 
        this.estadistica.cantidad_movimientos = this.cantidadMovimientos; 
        

        // guardo los datos 
        if (await this.juegosService.guardarDatosBusquedaDelTesoro(this.estadistica)) {
          this.sweetAlert.crearMensajeJuego(mensaje, `¡Gracias por jugar! sus datos se encuentran guardados`);
          this.router.navigate(['/']);
        }
        
        this.router.navigate(['/']);
      }


    } catch (error: any) {
      // manejo errores 
      this.sweetAlert.crearMensajeError(`Error al insertar estadisticas`);
      console.error(error.message);
      this.router.navigate(['/']);
    }

  }

}


