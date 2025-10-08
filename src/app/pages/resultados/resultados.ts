import { Component, OnInit, OnDestroy, signal } from '@angular/core';

// Importo componentes
import { ResultadosAhorcado } from '../../components/resultados-juegos/resultados-ahorcado/resultados-ahorcado';
import { ResultadosMayorOMenor } from '../../components/resultados-juegos/resultados-mayor-o-menor/resultados-mayor-o-menor';
import { ResultadosPreguntados } from '../../components/resultados-juegos/resultados-preguntados/resultados-preguntados';
import { ResultadosBusquedaDelTesoro } from '../../components/resultados-juegos/resultados-busqueda-del-tesoro/resultados-busqueda-del-tesoro';

@Component({
  selector: 'app-resultados',
  imports: [ResultadosAhorcado, ResultadosMayorOMenor, ResultadosPreguntados, ResultadosBusquedaDelTesoro],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class Resultados implements OnInit, OnDestroy {
  
  juego = signal<string>(''); 

  private unsubscribe?: () => void;

  constructor(){}

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.unsubscribe) this.unsubscribe();
  }

  cambiarJuego(nuevoJuego: string) {
    this.juego.set(nuevoJuego);
  }

}
