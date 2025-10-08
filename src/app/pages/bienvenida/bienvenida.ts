import { Component, OnInit, signal } from '@angular/core';

// Relacionado a los datos de los usuarios
import { User } from '@supabase/supabase-js'
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { Chat } from '../../components/chat/chat';

import { SweetAlertService } from '../../modals/sweet-alert';
import { CapitalizePipe } from '../../pipes/capitalize-pipe';


@Component({
  selector: 'app-bienvenida',
  imports: [Chat, CapitalizePipe],

  standalone: true,
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css'
})
export class Bienvenida implements OnInit {
  
  usuario = signal<User | null>(null); 

  mostrarUsuarios = signal(false);

  constructor( private supabase: Supabase, private router: Router, private route: ActivatedRoute, private sweetAlert: SweetAlertService) {};

  // Inicializo el componente verificando si hay o no una session

  async ngOnInit(): Promise<void> {
    // obtengo el usuario y su session 
    const usuarioData = this.route.snapshot.data['user'];

    this.usuario.set(usuarioData);
   
    // escuchar cambios del usuario futuros de auth 
    this.supabase.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.usuario.set(session.user);
      }
    })

  }

  validarChat(event: Event) {
    if (!this.usuario()) {
      event.preventDefault(); 
      this.sweetAlert.crearMensajeError("Debes loguearte primero");
      this.router.navigate(['/login']);
    }
  }


  // Voy al juego correspondiente
  irAlJuego(juego: string) {
    this.router.navigate(['/' + juego]);
  }

}
