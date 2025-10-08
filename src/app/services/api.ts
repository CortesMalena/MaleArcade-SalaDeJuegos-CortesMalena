import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { UsuarioGitHub } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})

export class Api {

  private apiUrl = 'https://api.github.com/users/CortesMalena';

  constructor (private http: HttpClient) {};

  // Realizo el uso de forkJoin, operador que me permite ejecutar peticiones en paralelo
  getUsuarioYRepos(): Observable<{ usuario: UsuarioGitHub; repos: any[] }> {
   return forkJoin({ // obtengo usuario y repositorios al mismo tiempo
    usuario: this.http.get<UsuarioGitHub>(this.apiUrl),
    repos: this.http.get<any[]>(`${this.apiUrl}/repos`) 
    });
  }
}
