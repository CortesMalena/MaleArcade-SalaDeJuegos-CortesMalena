import { Component, OnInit, signal, input, OnDestroy, inject} from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, ValidationErrors, AbstractControl, ValidatorFn} from '@angular/forms';

import { ChatService } from '../../services/chat-service';
import { chat } from '../../interfaces/interfaces';

import { SweetAlertService } from '../../modals/sweet-alert';

import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { Supabase } from '../../services/supabase';

import { Autofocus } from '../../directives/auto-focus'; 
import { FechaPersonalizadaPipe } from '../../pipes/fecha-personalizada-pipe';

@Component({
  selector: 'app-chat',
  imports: [Autofocus, ReactiveFormsModule, FechaPersonalizadaPipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {

  // obtenemos el usuario del padre 
  usuario = input.required<User | null>();

  // signal para almacenar mensajes
  mensajes = signal<chat[]>([]);   
 
  // Funcion que deja de escuchar  
  private unsubscribe?: () => void;

  private fb = inject(FormBuilder); 

  // inyecto lo requerido 
  constructor( private chatService: ChatService, private sweetAlert: SweetAlertService, private router: Router, private supabase: Supabase) {
  }

  async ngOnInit() {

    if (!this.usuario()) {
      return;
    }

    // Traigo historial
    this.obtenerMensajes();

    // Me suscribo a los nuevos mensajes y guardo en la funcion unsuscribe
    this.unsubscribe = this.chatService.listenMensajes((nuevo) => {
      this.mensajes.update((anterior) => [...anterior, nuevo]);
    });
  }

  ngOnDestroy() {
    // dejo de escuchar al destruir el componente para evitar memory leaks
    if (this.unsubscribe) this.unsubscribe();
  }

  chatForm = this.fb.nonNullable.group({
    texto: ['', [Validators.required, Validators.maxLength(30), this.noSoloEspacios()]]
  });
  
  noSoloEspacios(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value || '';
      return valor.trim().length === 0 ? { soloEspacios: true } : null;
    };
  }
  
  // Logica para enviar un mensaje a la base de datos
  async enviarMensaje() {
    const usuarioActual = this.usuario();

    if (!usuarioActual) {   // verifico nuevamente, aunque este controlado por el CanActivate y en el componente bienvenida
      this.sweetAlert.crearMensajeError("Inicia sesion por favor");
      this.router.navigate(['/login']);
      return
    };  

    if (this.chatForm.invalid) {
      const textoCtrl = this.chatForm.controls.texto;

      if (textoCtrl.hasError('required')) {
        this.sweetAlert.crearMensajeError("No envíes mensajes vacíos por favor");
        this.chatForm.reset();
      } else if (textoCtrl.hasError('soloEspacios')) {
        this.sweetAlert.crearMensajeError("El mensaje no puede contener solo espacios");
        this.chatForm.reset();
      } else if (textoCtrl.hasError('maxlength')) {
        this.sweetAlert.crearMensajeError("El mensaje no puede superar los 30 caracteres");
        this.chatForm.reset();
      }
      return;
    }

    const { texto = ""} = this.chatForm.value;
    
    try {

      // mando el mensje a la base de datos
      await this.chatService.mandarMensaje( usuarioActual!.id, usuarioActual!.user_metadata['nombre'], texto);

      // limpiar input
      this.chatForm.reset();
      
    } catch (error: any) {
      // manejo errores 
      this.sweetAlert.crearMensajeError(`Ocurrio un error al enviar un mensaje`);
      console.error(`${error.message}`)
    }
   
  }

  // Logica para obtener los mensaje a la base de datos
  async obtenerMensajes() {

    try {
      // obtengo todos los mensajes
      const historial = await this.chatService.obtenerMensajes();
      this.mensajes.set(historial);

    }  catch (error: any) {
      this.sweetAlert.crearMensajeError(`Ocurrio un error al obtener los mensajes`);
      console.error(`${error.message}`)
    }
    
  }

}
