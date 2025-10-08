import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Ahorcado, EstadisticasAhorcado, EstadisticaMayorOMenor, EstadisticaBusquedaDelTesoro, EstadisticaPreguntados } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class JuegosService {

  private supabase: SupabaseClient;

  // Inyecto el servicio Supabase
  constructor(private supabaseService: Supabase) {

    // Obtengo la instancia del cliente de Supabase
    this.supabase = this.supabaseService.getClient();
  }

  ///////////////
  // AHORCADO //
  //////////////

  // Obtener TODOS los datos del ahorcado -> en caso de ser necesario
  async obtenerDatosAhorcado(): Promise<{ data: Ahorcado[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('ahorcado')
      .select('*');

    if (error) throw new Error(`Ocurrió un error al obtener los datos del ahorcado: ${error.message}`);
    
    return { data, error };
  }

  // Obtengo la cantidad de palabras
  async obtenerCantidadTotalPalabrasAhorcado(): Promise <number> {
    const { count, error } = await this.supabase
    .from('ahorcado')
    .select('id', { count: 'exact', head: true });

    if (error) throw error;
    // pasa el error y no trae datos
    if (!count) throw new Error('No hay palabras disponibles'); 

    return count;
  }

  // Obtengo una palabra random directamente desde la base de datos
  async obtenerAhorcadoRandom(): Promise<Ahorcado | null>  {

    const total = await this.obtenerCantidadTotalPalabrasAhorcado();
    
    const indiceRandom = Math.floor(Math.random() * total);

    const { data, error } = await this.supabase
    .from('ahorcado')
    .select('*')
    .range(indiceRandom, indiceRandom) // range para no tener problema con posibles registros borrados
    .single();

    if (error) throw error;

    return data;
  }

  // Guardo los datos del ahorcado 
  async guardarDatosAhorcado (estadistica: EstadisticasAhorcado): Promise<boolean> {
    const { error } = await this.supabase
    .from('estadisticas_ahorcado')
    .insert([
      {
        usuario_id: estadistica.usuario_id,
        palabra_id: estadistica.palabra_id,
        nombre_usuario: estadistica.nombre_usuario,
        mail_usuario: estadistica.mail_usuario,
        palabra: estadistica.palabra,
        letras_seleccionadas: estadistica.letras_seleccionadas,
        tiempo: estadistica.tiempo,
        vidas_restantes: estadistica.vidas_restantes,
        gano: estadistica.gano,
        puntos: estadistica.puntos
      }
    ]);

    if (error) throw error;
    
    return true;
  }
  
  // Obtengo las estadisticas del ahorcado
  async obtenerEstadisticasAhorcado (): Promise<any>{
    const { data, error } = await this.supabase
      .from('estadisticas_ahorcado')
      .select('*')
      .eq('gano', true)
      .order('puntos', { ascending: false })
      .order('vidas_restantes', { ascending: false })
      .order('tiempo', { ascending: true }); 

    if (error) throw error;

    return data as EstadisticasAhorcado[];
  }

  ///////////////////
  // MAYOR O MENOR // 
  /////////////////// 

  // Guardo los datos del MAYOR O MENOR 
  async guardarDatosMayorOMenor (estadistica: EstadisticaMayorOMenor): Promise<boolean> {
    const { error } = await this.supabase
    .from('estadisticas_mayor_o_menor')
    .insert([
      {
        usuario_id: estadistica.usuario_id,     
        nombre_usuario: estadistica.nombre_usuario,
        mail_usuario: estadistica.mail_usuario, 
        puntos: estadistica.puntos,
        racha_actual: estadistica.racha_actual,
        racha_maxima: estadistica.racha_maxima,
        vidas_restantes: estadistica.vidas_restantes,
        cartas_acertadas: estadistica.cartas_acertadas,
        cartas_totales: estadistica.cartas_totales,
        tiempo: estadistica.tiempo,     

      }
    ]);

    if (error) throw error;
    
    return true;
  }
  
  // Obtengo las estadisticas del juego Mayor o menor
  async obtenerEstadisticasMayorOMenor () : Promise<any>{
    const { data, error } = await this.supabase
      .from('estadisticas_mayor_o_menor')
      .select('*')
      .order('puntos', { ascending: false })
      .order('racha_maxima', { ascending: false})
      .order('vidas_restantes', { ascending: false })
      .order('tiempo', { ascending: true });

    if (error) throw error;

    return data;
  }

  ///////////////////
  // BUSQUEDA DEL TESORO // 
  /////////////////// 

  // Guardo los datos de la busqueda del tesoro 
  async guardarDatosBusquedaDelTesoro (estadistica: EstadisticaBusquedaDelTesoro): Promise<boolean> {
    const { error } = await this.supabase
    .from('estadisticas_busqueda_del_tesoro')
    .insert([
      {
        usuario_id: estadistica.usuario_id,     
        nombre_usuario: estadistica.nombre_usuario,
        mail_usuario: estadistica.mail_usuario, 
        puntos: estadistica.puntos,
        vidas_restantes: estadistica.vidas_restantes,
        tiempo: estadistica.tiempo,     
        cantidad_movimientos: estadistica.cantidad_movimientos,
        gano: estadistica.gano
      }
    ]);

    if (error) throw error;
    
    return true;
  }

  // Obtengo las estadisticas del juego Mayor o menor
  async obtenerEstadisticasBusquedaDelTesoro () : Promise<any>{
    const { data, error } = await this.supabase
      .from('estadisticas_busqueda_del_tesoro')
      .select('*')
      .eq('gano', true)
      .order('puntos', { ascending: false })
      .order('vidas_restantes', { ascending: false })
      .order('cantidad_movimientos', { ascending: true })
      .order('tiempo', { ascending: true });

    if (error) throw error;

    return data;
  }

  ///////////////////
  // PREGUNTADOS // 
  /////////////////// 

  // Guardo los datos del preguntados
  async guardarDatosPreguntados (estadistica: EstadisticaPreguntados): Promise<boolean> {
    const { error } = await this.supabase
    .from('estadisticas_preguntados')
    .insert([
      {
        usuario_id: estadistica.usuario_id,     
        nombre_usuario: estadistica.nombre_usuario,
        mail_usuario: estadistica.mail_usuario, 
        puntos: estadistica.puntos,
        tiempo_promedio: estadistica.tiempo_promedio,     
        respuestas_correctas: estadistica.respuestas_correctas,
      }
    ]);

    if (error) throw error;
    
    return true;
  }

  // Obtengo las estadisticas del preguntados
  async obtenerEstadisticasPreguntados() : Promise<any>{
    const { data, error } = await this.supabase
      .from('estadisticas_preguntados')
      .select('*')
      .order('puntos', { ascending: false })
      .order('respuestas_correctas', { ascending: false })
      .order('tiempo_promedio', { ascending: true });

    if (error) throw error;

    return data;
  }


}
