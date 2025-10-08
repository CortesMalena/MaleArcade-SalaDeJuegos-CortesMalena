import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Relacionado a la base de datos 
import { Supabase } from '../../services/supabase';

// Relacionado al formulario y html
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

// relacionado a los modales 
import { SweetAlertService } from '../../modals/sweet-alert';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro{
  // mensajes 
  mensajeDeError = signal("");

  // Establezco si esta cargando
  cargando = signal(false);

  private fb = inject(FormBuilder); 

  constructor (
    private supabase: Supabase, 
    private router: Router,
    private sweetAlert: SweetAlertService,
  ) {}

  registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required ,Validators.minLength(6), this.noSoloEspacios()]],
    nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), this.noSoloEspacios()]], // Permite letras (mayúsculas y minúsculas), tildes y espacios.
    apellido: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), this.noSoloEspacios()]], // Rechaza números o caracteres especiales.
    edad: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  noSoloEspacios(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value || '';
      return valor.trim().length === 0 ? { soloEspacios: true } : null;
    };
  }

  async realizarRegistro () {
    if (this.registerForm.invalid) {
      this.mensajeDeError.set("Por favor, complete los datos de forma correcta.");
      this.registerForm.markAllAsTouched();
      return;
    }

    this.mensajeDeError.set("");
    
    const { 
      email = "",
      password = "",
      nombre = "", 
      apellido = "", 
      edad = 0 
    } = this.registerForm.value;

    try {
      
      this.cargando.set(true)
      
      const {data: usuarioAuth, error: errorAuth }= await this.supabase.signUp(email, password, nombre, apellido, edad);

      if (errorAuth || !usuarioAuth?.user) {
        throw new Error ('Error registrando al usuario');
      }

      this.sweetAlert.crearMensajeExito("¡El registro fue realizado de forma exitosa! Revisa tu correo para la confirmación de la cuenta!");
      this.router.navigate(['/login']);
      
    } catch (error: any) {
      this.sweetAlert.crearMensajeError(error.message || "Error al registrarse");
    } finally {
      this.cargando.set(false);
    }
  }

}
