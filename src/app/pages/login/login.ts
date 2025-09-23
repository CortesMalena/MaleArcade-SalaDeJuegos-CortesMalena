import { Component, inject, signal} from '@angular/core';

// Relacionado a la base de datos 
import { Supabase } from '../../services/supabase';

// Relacionado al formulario y html
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// relacionado a los modales 
import { SweetAlertService } from '../../modals/sweet-alert';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login  {
  // mensajes 
  mensajeDeError = signal("");

  // establezco una carga 
  cargando = signal(false) ;

  //signals 
  mostrarUsuarios = signal(false);

  private fb = inject(FormBuilder); 

  constructor (
    private supabase: Supabase, 
    private router: Router, 
    private sweetAlert: SweetAlertService,) {}

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
      this.mensajeDeError.set( "Por favor, complete los datos de forma correcta.")
      return;
    }

    this.mensajeDeError.set("");

    const { email = "",password = "",} = this.inicioForm.value;

    this.llamarALogin(email, password);
  }
  
  // llamo al login de supabase
  async llamarALogin(email: string, password:string) {
    this.cargando.set(true);

    try {
      const {user} = await this.supabase.login(email, password);

      if (user) {
        this.sweetAlert.crearMensajeExito("Se inició sesión correctamente.");
        this.router.navigate(['/bienvenida'])
      }
      
    } catch (error: any) {
      this.sweetAlert.crearMensajeError(error.message || "Error al Iniciar sesión, verifique sus datos.");

    } finally {
      this.cargando.set(false);
    }
  }
}
