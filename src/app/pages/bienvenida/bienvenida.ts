import { Component, OnInit, signal } from '@angular/core';

// Relacionado a los datos de los usuarios
import { User } from '@supabase/supabase-js'
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { Chat } from '../../components/chat/chat';

@Component({
  selector: 'app-bienvenida',
  imports: [Chat],
  standalone: true,
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css'
})
export class Bienvenida implements OnInit {
  
  usuario = signal<User | null>(null); 
  usuario_nombre = signal< string>("");

  mostrarUsuarios = signal(false);

  constructor( private supabase: Supabase, private router: Router, private route: ActivatedRoute) {};

  // Inicializo el componente verificando si hay o no una session

  async ngOnInit(): Promise<void> {
    // obtengo el usuario y su session 
    const usuarioData = this.route.snapshot.data['user'];
    //const usuarioData = await this.supabase.getUser(); 

    this.usuario.set(usuarioData);
    this.usuario_nombre.set(usuarioData?.user_metadata['nombre']);
    console.log(this.usuario_nombre())


    // escuchar cambios del usuario futuros de auth 
    this.supabase.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.usuario.set(session.user);
      }
    })
  }

  // Voy al juego correspondiente
  irAlJuego(juego: string) {
    this.router.navigate(['/' + juego]);
  }

}
