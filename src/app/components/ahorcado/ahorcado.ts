import { Component, OnDestroy, OnInit, signal} from '@angular/core';

// Servicios 
import { JuegosService } from '../../services/juegos-service';
import { Supabase } from '../../services/supabase';

// Dependencias reactivas 
import { interval, Subscription } from 'rxjs';

// Servicio para mostrar modales 
import { SweetAlertService } from '../../modals/sweet-alert';

// Router y estadisticas 
import { Router } from '@angular/router';
import { EstadisticasAhorcado } from '../../interfaces/interfaces';


@Component({
  selector: 'app-ahorcado',
  imports: [],
  templateUrl: './ahorcado.html',
  styleUrls: ['./ahorcado.css']
})

export class Ahorcado implements OnInit, OnDestroy {
  
  // Lo requerido para el ahorcado 
  abecedario: string[] = [
    'A','B','C','D',
    'E','F','G','H',
    'I','J','K','L',
    'M','N','Ñ','O',
    'P','Q','R','S',
    'T','U','V','W',
    'X','Y','Z'
  ];
  letrasSeleccionadas = signal<string[]>([]);

  // Carga y tiempo 
  tiempo = signal(0);
  limite = signal(100);
  loading = signal(false);

  // Demás datos para el ahorcado 
  vidas = signal(6);
  puntos = signal(120);
  palabraAAdivinar: string = "";
  palabraMostrada = signal<string[]>([]);   
  pista = signal<string>('');
  
  // Guardo la suscripcion para desuscribirme mas tarde 
  private suscripcion!: Subscription;

  // Establezo los datos a guardar
  estadistica: EstadisticasAhorcado = {
  usuarioId: '',
  palabraId: 0,
  letrasSeleccionadas: [],
  tiempo: 0,
  vidasRestantes: 0,
  gano: false,
  puntos: 0,
  };

  // Inyecto lo necesario 
  constructor ( 
    private sweetAlert: SweetAlertService,
    private supabase: Supabase,
    private juegosService: JuegosService,
    private router: Router
  ){}

  ngOnInit(): void {

    // Obtengo la palabra a adivinar 
    this.obtenerPalabra();

    // Me suscribo a un intervalo de tiempo que nunca termina a menos que le establezca limites 
    this.suscripcion = interval(1000).subscribe(() => {
      this.tiempo.set(this.tiempo() + 1);
      
      // Si llego al limite me desuscribo y finalizo el juego 
      if (this.tiempo() >= this.limite()) {
        this.suscripcion.unsubscribe();

        this.finalizarJuego(false);
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    // Evito memory leaks (lo que hace que la aplicación consuma más memoria de la necesaria)
    this.suscripcion.unsubscribe();
  }


  seleccionarLetra(letra: string) {
    
    // Evito repetidas 
    if (this.letrasSeleccionadas().includes(letra)) return; 

    // Agregamos la letra a las letras seleccionadas
    this.letrasSeleccionadas.set([...this.letrasSeleccionadas(), letra]);

    // Establecemos el mismo formato
    const palabra = this.palabraAAdivinar.toLocaleUpperCase();    

    // Establecemos variables para actualizar 
    const palabraAMostrar = this.palabraMostrada();     
    const palabraActualizada: string[] = [];          

    // Actualizo la palabra a mostrar 
    this.actualizarPalabraMostrada(letra, palabra, palabraAMostrar, palabraActualizada);

    // Situación de perder 
    if (!palabra.includes(letra)) {
      this.calcularPuntosAhorcado();

      if (this.vidas() <= 0) {
        this.finalizarJuego(false);
        this.router.navigate(['/']);
      }
    }

    // Situación de ganar 
    if (!this.palabraMostrada().includes("_")) {
      this.finalizarJuego(true);
      this.router.navigate(['/']);
    }
  }

  calcularPuntosAhorcado() {
    this.vidas.set(this.vidas() - 1);
    // actualizo los puntos asegurando que nunca llegue a 0
    const puntosActualizados = Math.max(0, this.puntos() - 20);
    this.puntos.set(puntosActualizados);
  }

  actualizarPalabraMostrada(letra: string, palabra:string, palabraAMostrar: string[], palabraActualizada:string[]) {
    
    // Recorro la palabra y actualizo la palabra mostrada
    for (let i = 0; i < palabra.length; i++) {

      // Si es la letra que se encuentra la palabra || si ya se adivino esa letra
      if (palabra[i] === letra || palabraAMostrar[i] !== "_") {
        palabraActualizada.push(palabra[i]);
      } else {
        palabraActualizada.push("_");
      }
    }

    // la actualizo 
    this.palabraMostrada.set(palabraActualizada);
  }


  async obtenerPalabra() {
    this.loading.set(true);

    try {
      // obtengo una palabra random
      const data = await this.juegosService.obtenerAhorcadoRandom();

      if (data) {

        // Establezco todo para jugar
        this.palabraAAdivinar = data.palabra;
        this.palabraMostrada.set(Array(data.palabra.length).fill('_'));
        this.pista.set(data.pista);
        this.letrasSeleccionadas.set([]);
        this.vidas.set(6);
        this.tiempo.set(0);
        this.pista.set(data.pista);
        this.estadistica.palabraId = data.id ?? 0;

      }

    } catch (error: any) {
      // manejo de errores
      this.sweetAlert.crearMensajeError(`Ocurrio un error al obtener palabra:`);
      console.error(error.message);
      this.router.navigate(['/']);
    } finally {
      this.loading.set(false);
    }
  }

  async finalizarJuego(victoria: boolean) {
    // mensajes en caso de perder y ganar personalizados
    let mensaje = `¡Opss Perdiste! la palabra era ${this.palabraAAdivinar}`;
    if (victoria) {
      mensaje = `¡Ganaste! la palabra era ${this.palabraAAdivinar}`;
    }

    try {
      // obtengo el usuario 
      const usuarioData = await this.supabase.getUser(); 

      if (usuarioData) {
        // Actualizo las estadisticas 
        this.estadistica.usuarioId = usuarioData.id
        this.estadistica.letrasSeleccionadas = this.letrasSeleccionadas();
        this.estadistica.tiempo = this.tiempo(); 
        this.estadistica.vidasRestantes = this.vidas(); 
        this.estadistica.gano = victoria; 
        this.estadistica.puntos = this.puntos();

        // guardo los datos 
        if (await this.juegosService.guardarDatosAhorcado(this.estadistica)) {
          this.sweetAlert.crearMensajeJuego(mensaje, `¡Gracias por jugar! sus datos se encuentran guardados`);
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
