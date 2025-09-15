import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// Relacionado a los datos de los usuarios
import { User } from '@supabase/supabase-js'
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bienvenida',
  imports: [],
  standalone: true,
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css'
})
export class Bienvenida implements OnInit {
  
  usuario: User | null = null; 
  usuario_nombre: string = "";

  constructor( private supabase: Supabase, private cdr: ChangeDetectorRef, private router: Router) {};

  // Inicializo el componente verificando si hay o no una session

  async ngOnInit(): Promise<void> {
    // obtengo el usuario y su session 
    const usuarioData = await this.supabase.getUser(); 
    this.usuario = usuarioData;
    this.usuario_nombre = this.usuario?.user_metadata['nombre'];
    this.cdr.detectChanges();

    // escuchar cambios del usuario futuros de auth 
    this.supabase.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.usuario = session.user;
        this.cdr.detectChanges();
      } else {
        this.usuario = null;
        this.usuario_nombre = "";
        this.cdr.detectChanges();
      }
    })
  }

  // Voy al juego correspondiente
  irAlJuego(juego: string) {
    this.router.navigate(['/' + juego]);
  }

}
