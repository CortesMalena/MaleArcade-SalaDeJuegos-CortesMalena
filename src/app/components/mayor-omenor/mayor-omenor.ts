import { Component, OnDestroy, OnInit, signal} from '@angular/core';
import { SweetAlertService } from '../../modals/sweet-alert';
import { interval, Subscription } from 'rxjs';
import { Carta, EstadisticaMayorOMenor } from '../../interfaces/interfaces';
import { JuegosService } from '../../services/juegos-service';
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mayor-omenor',
  imports: [],
  templateUrl: './mayor-omenor.html',
  styleUrl: './mayor-omenor.css'
})
export class MayorOMenor implements OnInit, OnDestroy{

  // Relacionado a las cartas 
  palos = ["corazones", "picas", "diamantes", "treboles"];
  nombres = ["as", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
  cartas: Carta[] = [];

  cartaActual = signal<Carta>({
    valor: 0, 
    nombre: '', 
    palo: '', 
    imagen: ''
    });

  // al tiempo y la espera 
  tiempo = signal(0);
  limite = signal(100);
  loading = signal(false);

  // Guardo la suscripcion para desuscribirme mas tarde 
  suscripcion!: Subscription;

  // vidas y recursos a guardar 
  vidas = signal(6);
  puntos = signal(0);
  racha = signal(0);
  rachaMaxima: number  = 0;
  cartasAdivinadas : Carta[] = [];;

  // Formato para guardar 
  estadistica: EstadisticaMayorOMenor = {
    usuario_id: '',    
    puntos: 0,
    racha_actual: 0,
    racha_maxima: 0,
    vidas_restantes: 0,
    cartas_acertadas: 0,
    cartas_totales: 0,
    tiempo: 0,   
  };
  

  // inyecto lo requerido
  constructor(
    private sweetAlert: SweetAlertService,
    private JuegosService: JuegosService,
    private supabase: Supabase,
    private router: Router
  ) {}

  ngOnInit() {
    // genero las cartas una vez inicializo el componente 
    this.generarCartas()

    this.actualizarCarta()
    
    this.suscripcion = interval(1000).subscribe(() => {
        this.tiempo.set(this.tiempo() + 1);
    
        if (this.tiempo() >= this.limite()) {
          this.suscripcion.unsubscribe();
          
          this.finalizarjuego(); 
        }});
  }

  ngOnDestroy() {
    // Limpio la suscripcion cuando se destruye el componente, evito memory leaks
    this.suscripcion.unsubscribe();
  }

  // Genero las cartas con sus valores, nombre, palo e imagen.
  generarCartas () {
    this.loading.set(true); 
    const rutaBaseCartas = '../../../assets/cartas/';

    this.palos.forEach(palo => {
      this.nombres.forEach((nombre, index) => {
        this.cartas.push({
          valor: index + 1, // As = 1, 11 = J, 12 = Q, 13 = K
          nombre: nombre,
          palo: palo,
          imagen: `${rutaBaseCartas}${nombre}_${palo}.png` 
        });
      });
    });
    this.loading.set(false); 
  }

  // Genero la siguiente carta
  generarSiguienteCarta(prediccion: "mayor" | "menor") {

    // agarro los valores 
    const valorAnterior = this.cartaActual().valor; 
    this.actualizarCarta(); 
    const valorActual = this.cartaActual().valor; 

    // verifico la predicción 
    let resultado = this.generarPrediccion(prediccion, valorAnterior, valorActual); 

    // realizo la puntacion 
    this.realizarPuntuacion(resultado); 

  }

  // Actualizo la carta actual
  actualizarCarta() {
    // Agarro un indice randomizado, elimino la carta del mazo y la seteo como nueva
    const indice = Math.floor(Math.random() * this.cartas.length);
    const carta = this.cartas.splice(indice, 1)[0]; 
    this.cartaActual.set(carta);
  }

  // Realizo la puntuacion
  realizarPuntuacion(resultado: boolean) {

    // Evaluo si fue bueno o malo el resultado
    if (resultado) {
      this.cartasAdivinadas.push(this.cartaActual());
      this.puntos.set(this.puntos() + 10); // suma fija
      this.racha.set(this.racha() + 1);

      if (this.racha() > this.rachaMaxima) {
        this.rachaMaxima = this.racha();
      }

    } else {
      this.racha.set(0);
      this.vidas.set(this.vidas() - 1);
    }

    if (this.vidas() === 0 || this.cartas.length === 0) {
        this.finalizarjuego();
      }
  }

  // Establezco si adivino o no la carta 
  generarPrediccion (prediccion: "mayor" | "menor", valorAnterior: number, valorActual: number): boolean {
    // switch case en caso de que eligio 
    switch (prediccion) {
      case "mayor":
        return valorActual >= valorAnterior; 
      case "menor":
        return valorActual <= valorAnterior; 
      default:
        return false;
    }
  }

  // finalizo el juego
  async finalizarjuego() {

    try {
      // Obtengo la informacion del usuario
      const usuarioData = await this.supabase.getUser(); 

      if (usuarioData) {
        // establezco estadisticas
        this.estadistica.usuario_id = usuarioData.id
        this.estadistica.puntos = this.puntos();
        this.estadistica.racha_actual = this.racha(); 
        this.estadistica.racha_maxima = this.rachaMaxima; 
        this.estadistica.vidas_restantes = this.vidas(); 
        this.estadistica.cartas_acertadas = this.cartasAdivinadas.length; 
        this.estadistica.cartas_totales = 52 - this.cartas.length; 
        this.estadistica.tiempo = this.tiempo(); 
    
        // Guardo los datos 
        if (await this.JuegosService.guardarDatosMayorOMenor(this.estadistica)) {
          this.sweetAlert.crearMensajeJuego('¡Termino!', `¡Gracias por jugar! sus datos se encuentran guardados`);
          this.router.navigate(['/']);
        }
      }

      
    } catch (error: any) {
      // manejo errores
      this.sweetAlert.crearMensajeError(`Error al insertar estadisticas`);
      console.error(error.message);
      this.router.navigate(['/']);
    }

    this.sweetAlert.crearMensajeJuego("¡Se Termino!", "Gracias por jugar");
  }



}
