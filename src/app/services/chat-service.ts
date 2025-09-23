
import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { chat } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase: SupabaseClient;

  // Inyecto el servicio Supabase
  constructor(private supabaseService: Supabase) {

    // Obtengo la instancia del cliente de Supabase
    this.supabase = this.supabaseService.getClient();
  }

 
  // Obtengo los mensajes del chat 
  async obtenerMensajes(): Promise<chat[]> {
    const { data, error } = await this.supabase
      .from('chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data as chat[];
  }


  // Inserto un mensaje
  async mandarMensaje(user_id: string, nombre:string, mensaje: string): Promise<void> {
    const { error } = await this.supabase
      .from('chat')
      .insert([{ user_id, mensaje, nombre }]);

    if (error) throw error;
  }


  // Escucho constantemente lo tabla chat
  listenMensajes(callback: (payload: chat) => void) {
    // suscripción a todos los insert en la canal se supabase en la tabla chat
    const channel = this.supabase
      .channel('sala-chat')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public',
          table: 'chat'
        },
        (payload) => {
          callback(payload.new as chat); 
          // al haber un mensaje nuevo ejecuto un callback que lo devuelve y ejecuta a tiempo real
        }
      )
      .subscribe(); // me suscribo apara obtener los insert

    return () => { // para dejar de escuchar
      this.supabase.removeChannel(channel);
    };
  }

}
