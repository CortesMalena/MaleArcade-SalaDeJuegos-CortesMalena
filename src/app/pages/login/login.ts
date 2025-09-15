import { Component, inject, ChangeDetectorRef, signal} from '@angular/core';

// Relacionado a la base de datos 
import { Supabase } from '../../services/supabase';

// Relacionado al formulario y html
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // mensajes 
  mensajeDeError = "";

  // establezco una carga 
  cargando = false;

  //signals 
  mostrarUsuarios = signal(false);

  private fb = inject(FormBuilder); 

  constructor (private supabase: Supabase, private router: Router, private cdr: ChangeDetectorRef) {}

  inicioForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // evento del mouse para mostrar los usuarios de inicio de sesión rapida
  toggleUsuarios(event: MouseEvent): void {
  event.preventDefault();
  this.mostrarUsuarios.update(mostrar => !mostrar); 
  }


  // Obtengo los datos del form y los envio al login
  async realizarInicioDeSesion() {
    if (this.inicioForm.invalid) {
      this.mensajeDeError = "Por favor, complete los datos de la forma correcta"
      this.cdr.detectChanges();
      return;
    }

    const { email = "",password = "",} = this.inicioForm.value;

    this.llamarALogin(email, password);
  }
  
  // llamo al login de supabase
  async llamarALogin(email: string, password:string) {
    this.cargando = true;
    try {
      const {user} = await this.supabase.login(email, password);

      if (user) {
        this.cargando = false;
        this.router.navigate(['/bienvenida'])
      }
      
    } catch (error: any) {
      this.mensajeDeError = error.message || "Error al Iniciar sesión, verifique sus datos" ;  
      this.cdr.detectChanges();
    }
  }
}
