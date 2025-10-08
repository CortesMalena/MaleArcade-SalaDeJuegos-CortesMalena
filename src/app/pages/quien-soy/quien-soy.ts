import { Component, OnInit, ChangeDetectorRef, input } from '@angular/core';

// Intefaces y componentes 
import { Api } from '../../services/api';
import { UsuarioGitHub } from '../../interfaces/interfaces';
import { UsuarioCard } from '../../components/usuario-card/usuario-card';

// Directivas 
import { HoverScale } from '../../directives/hover-scale';

@Component({
  selector: 'app-quien-soy',
  imports: [UsuarioCard, HoverScale],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})

export class QuienSoy implements OnInit {

  // Establezco variables 
  usuario: UsuarioGitHub | null = null;
  repositorios: number= 0;
  loading: boolean = true;
  error="";

  constructor (private api: Api, private cdr: ChangeDetectorRef) {
  }

  // Inicializo el componente con la carga del usuario
  ngOnInit(): void {
    this.cargarUsuario();
  }

  // cargo el usuario de la api
  cargarUsuario(){
    this.loading = true;
    this.api.getUsuarioYRepos().subscribe({

      // obtengo los datos 
      next: ( {usuario, repos}) => {
        this.usuario = usuario;
        this.repositorios = repos.length;
        this.loading = false;
        this.cdr.detectChanges();

      },
      // manejo errores
      error: (error) => {
        console.error('Error cargando al usuario: ', error);
        this.error = "Error al obtener los datos del usuario";
        this.loading = false;
        this.cdr.detectChanges();
      }
    })
  }
  

}
