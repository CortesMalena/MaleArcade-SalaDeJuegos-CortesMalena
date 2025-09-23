import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient, Session, User, AuthChangeEvent } from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root'
})

export class Supabase {
 
  private supabase: SupabaseClient
  
  constructor() {
    // Creo un cliente con la clave y la url
    this.supabase = createClient( environment.supabaseUrl, environment.supabaseKey); 
  }

  // Función asíncrona del logeo de usuario
  async login(email: string, password: string): Promise<{ user: User | null; session: Session | null; metadata?:any }> { // session indica la confirmacion del email

    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error('Ocurrió un error al iniciar sesión');
    };

    const metadata = data.user?.user_metadata;

    return { user: data.user, session: data.session, metadata};
  }

  // Función asíncrona de registro
  async signUp(email: string, password: string, nombre:string, apellido:string, edad:number): Promise<{ data: { user: User | null }; error: any }> {
    // Registro en tabla auth.users
    const { data, error} = await this.supabase.auth.signUp({ 
      email, 
      password,
      options: { // uso metadata de auth.users
        data: {
          nombre: nombre,
          apellido: apellido, 
          edad: edad
        }
      } });

    if (error) {
      throw new Error('Ocurrió un error en el registro')
    } ;

    if (data.user && data.user.identities?.length == 0) {
      throw new Error('Correo ya registrado')
    }

    return {data, error};
  }

  // Cierre de sesión 
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Obtenemos el user o null en caso de que no haya sesión 
  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();

    return data.user; // puede ser null si no hay sesión
  }

  // Evento que escucha los cambios de sesión del usuario 
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }


  // para obtener el cliente de supabase y usuarlo en los otros servicios
  getClient(): SupabaseClient {
    return this.supabase;
  }


}

