import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
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
  usuario: User | null = null; 

  constructor(private router: Router, private supabase: Supabase, private cdr: ChangeDetectorRef) {};

  // Inicializo el componente verificando si hay o no una session
  async ngOnInit(): Promise<void> {
    this.usuario = await this.supabase.getUser(); 
    this.cdr.detectChanges();

    this.supabase.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.usuario = session.user || null;
        this.cdr.detectChanges();
      }
    })
  }

  async cerrarSesion() {
    this.usuario = null;
    this.cdr.detectChanges();
    await this.supabase.logout();
    this.router.navigate(['/']);
  }

}
