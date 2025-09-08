import { Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

// defino una interface Usuario
export interface Usuario { 
  login:string;
  avatar_url: string;
  repos_url: string;
  followers:string;
}

@Injectable({
  providedIn: 'root'
})

export class Api implements OnInit {
  private usuario = signal<Usuario | null>(null);

  private apiUrl = 'https://api.github.com/users/CortesMalena';

  constructor (private http: HttpClient) {};


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
   return forkJoin({
    usuario: this.http.get<Usuario>(this.apiUrl),
    repos: this.http.get<any[]>(`${this.apiUrl}/repos`) // para ver la cantidad de repositorios
    });
  }
}
