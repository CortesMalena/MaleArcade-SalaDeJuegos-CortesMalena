import { Component, inject, signal} from '@angular/core';

// Relacionado a la base de datos 
import { Supabase } from '../../services/supabase';

// Relacionado al formulario y html
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// relacionado a los modales 
import { SweetAlertService } from '../../modals/sweet-alert';

//Usuarios pre-cargados 
import { USUARIOS_PREDEFINIDOS } from '../../../environments/environment';

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

  //From builder 
  private fb = inject(FormBuilder); 

  //Usuarios pre-cargados 
  usuarios = USUARIOS_PREDEFINIDOS;

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
  

  realizarInicioRapido(nombre:string) {

    nombre = nombre.toLocaleLowerCase();

    const usuario = this.usuarios.find(u => u.nombre === nombre);
    
    if (!usuario) {
      this.sweetAlert.crearMensajeError("Usuario de inicio rapido no encontrado");
      console.error('Usuario de inicio rapido no encontrado');
      return;
    }

    this.llamarALogin(usuario.email, usuario.password);

  }

  // llamo al login de supabase
  async llamarALogin(email: string, password: string) {
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
