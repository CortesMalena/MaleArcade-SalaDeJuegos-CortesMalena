import { Component, inject, ChangeDetectorRef } from '@angular/core';

// Relacionado a la base de datos 
import { Supabase } from '../../services/supabase';

// Relacionado al formulario y html
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  standalone: true,
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  // mensajes 
  mensajeDeExito = ""; 
  mensajeDeError = "";

  // Establezco si esta cargando
  cargando = false;

  private fb = inject(FormBuilder); 

  constructor (private supabase: Supabase, private cdr: ChangeDetectorRef) {}

  registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]], // Permite letras (mayúsculas y minúsculas), tildes y espacios.
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]], // Rechaza números o caracteres especiales.
    edad: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
  });


  async realizarRegistro () {
    if (this.registerForm.invalid) {
      this.mensajeDeError = "Por favor, complete los datos de la forma correcta"
      return;
    }

    this.cargando = true; 
    this.mensajeDeError = "";
    this.mensajeDeExito = "";
    this.cdr.detectChanges(); 

    const { 
      email = "",
      password = "",
      nombre = "", 
      apellido = "", 
      edad = 0 
    } = this.registerForm.value;

    try {
      
      const {data: usuarioAuth, error: errorAuth }= await this.supabase.signUp(email, password, nombre, apellido, edad);

      if (errorAuth || !usuarioAuth?.user) {
        throw new Error ('Error registrando al usuario');
      }

      this.mensajeDeExito = "¡El registro fue realizado de forma exitosa! Revisa tu correo para la confirmación de la cuenta!"
      this.cargando = false;
      this.mensajeDeError = "";
      this.cdr.detectChanges();

      
    } catch (error: any) {
      this.mensajeDeError = error.message || "Error al registrarse"; 
      this.cargando = false;
      this.mensajeDeExito = ""; 
      this.cdr.detectChanges();
    }
  }

}
