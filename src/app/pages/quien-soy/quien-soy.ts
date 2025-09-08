import { Component, OnInit, ChangeDetectorRef, input } from '@angular/core';
import { Api, Usuario } from '../../services/api';
import { UsuarioCard } from '../../components/usuario-card/usuario-card';

@Component({
  selector: 'app-quien-soy',
  imports: [UsuarioCard],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})

export class QuienSoy implements OnInit {

  // Establezco variables 
  usuario: Usuario | null = null;
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
