import { Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

// defino una interface Usuario
export interface Usuario { 
  login:string;
  avatar_url: string;
  repos_url: string;
  followers:string;
  following:string;
}

@Injectable({
  providedIn: 'root'
})

export class Api implements OnInit {
  // Signal reactivo que almacena la información de mi usuario de gitHub
  private usuario = signal<Usuario | null>(null);

  private apiUrl = 'https://api.github.com/users/CortesMalena';

  constructor (private http: HttpClient) {};

  // Inicializo el componente con los datos 
  ngOnInit(): void {
    this.http.get<Usuario>(`${this.apiUrl}`).subscribe({
      next: (data) => {
        this.usuario.set(data);
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      }
      
    })
  }

  // Realizo el uso de forkJoin, operador que me permite ejecutar peticiones en paralelo
  getUsuarioYRepos(): Observable<{ usuario: Usuario; repos: any[] }> {
   return forkJoin({ // obtengo usuario y repositorios al mismo tiempo
    usuario: this.http.get<Usuario>(this.apiUrl),
    repos: this.http.get<any[]>(`${this.apiUrl}/repos`) 
    });
  }
}
