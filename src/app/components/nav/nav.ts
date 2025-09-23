import { Component, OnInit, signal} from '@angular/core';
import { RouterLink, Router } from '@angular/router';

// Relacionado a los datos de los usuarios
import { User } from '@supabase/supabase-js'
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {
  usuario = signal<User | null>(null); 

  constructor(private router: Router, private supabase: Supabase) {};

  // Inicializo el componente verificando si hay o no una session
  async ngOnInit(): Promise<void> {
    this.usuario.set(await this.supabase.getUser()); 

    this.supabase.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.usuario.set(session.user);
      }
    })
  }

  async cerrarSesion() {
    this.usuario.set(null);
    await this.supabase.logout();
    this.router.navigate(['/login']);
  }

}
