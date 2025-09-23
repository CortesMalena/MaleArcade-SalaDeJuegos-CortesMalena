import { Component, OnInit, signal, input, OnDestroy} from '@angular/core';
import { ChatService } from '../../services/chat-service';
import { chat } from '../../interfaces/interfaces';
import { SweetAlertService } from '../../modals/sweet-alert';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {

  // obtenemos el usuario del padre 
  usuario = input.required<User | null>();

  // signal para almacenar mensajes
  mensajes = signal<chat[]>([]);   

  // signal para el input
  nuevoMensaje = signal<string>(''); 

  // Funcion que deja de escuchar  
  private unsubscribe?: () => void;

  // inyecto lo requerido 
  constructor( private chatService: ChatService, private sweetAlert: SweetAlertService, private router: Router) {

  }

  ngOnInit() {
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

  
  // Logica para enviar un mensaje a la base de datos
  async enviarMensaje() {
    const usuarioActual = this.usuario();

    if (!usuarioActual) {   // verifico nuevamente, aunque este controlado por el CanActivate y en el componente bienvenida
      this.sweetAlert.crearMensajeError("Inicia sesion por favor");
      this.router.navigate(['/login']);
      return
    };  
    
    try {
      
      const texto = this.nuevoMensaje();

      // verficio que no sea vacio 
      if (!texto.trim()) {
        throw new Error("No envies mensajes vacios por favor"); 
      }; 

      // mando el mensje a la base de datos
      await this.chatService.mandarMensaje( usuarioActual!.id, usuarioActual!.user_metadata['nombre'], texto);

      // limpiar input
      this.nuevoMensaje.set('');
      
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
