import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Pregunta } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {

  // JSON con preguntas y respuestas, opcion otorgada en clase
  private jsonUrl = '../assets/preguntados/data/preguntas.js';

  constructor(private http: HttpClient) {}

  getPreguntas(): Observable<Pregunta[]> {
    return this.http.get<{preguntas: Pregunta[]}>(this.jsonUrl)
      .pipe(
        map(response => response.preguntas)
      );
  }
}
